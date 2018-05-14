'use strict';
var zerofill = function(i){
  return ('00' + (i)).slice(-2);
};

var ymd = function(date){
  let d = new Date(date);
  return d.getFullYear() + '/'
    + zerofill(d.getMonth() + 1) + '/'
    + zerofill(d.getDate());
};

var linkFilter = function(query){
  var regex = new RegExp(query, 'ig');
  if(query === ''){
    regex = null;
  }
  return function(link){
    if(!link.url){return false;}
    if(!regex){return true;}
    var result = link.title.match(regex) ||
        link.url.match(regex) ||
        link.description.match(regex) ||
        link.keyword.reduce(function(acc, e){
          return acc || e.match(regex);
        }, false) ||
        link.category.reduce(function(acc, path){
          return acc || path.reduce(function(acc2, category){
            return acc2 || category.match(regex);
          }, false);
        }, false);
    return result;
  };
};

// define the item component
Vue.component('itemContent', {
  template: `
    <div class="dimmable" v-if="filter(link)">
      <div class="content">
        <div class="header">
          <i class="linkify icon"></i>
          <a :href="link.url" :target="link.target">{{link.title}}</a>
        </div>
        <div class="description">
          <div class="ui tiny tag labels" style="margin: 0.3em;">
            <a v-for="key in link.keyword" class="ui image label" @click="addTag(key)">
              {{key}}
            </a>
          </div>
          <div v-html="marked(link.description)"></div>

          <div class="ui breadcrumb" style="margin: 10px 0px">
            <div v-for="path in link.category">
              Path: <span v-for="(key, index) in path">
                <a class="section" @click="addTag(key)">{{key}}</a>
                <i v-if="path.length - index > 1" class="right angle icon divider"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="extra" v-if="link.ts">
          {{moment.unix(link.ts/1000).calendar()}}
        </div>
        <div class="ui horizontal link list" v-if="link.active.from || link.active.to">
          <div class="item">運用期間</div>
          <div class="item" v-if="link.active.from">
            {{ymd(link.active.from)}}
          </div>
          <div class="item">
            〜
          </div>
          <div class="item" v-if="link.active.to">
            {{ymd(link.active.to)}}
          </div>
        </div>
        <div class="extra">
          <button class="ui icon button" @click="copyMd(link)">
            <i class="clipboard icon"></i> Markdown
          </button>
          <button class="ui icon button" @click="copyOrg(link)">
            <i class="clipboard icon"></i> Org
          </button>
          <div class="right floated content">
            <button class="ui icon button" @click="isAdd = !isAdd">
              <i class="edit outline icon"></i>
            </button>
          </div>
        </div>
      </div>
      <add v-if="isAdd" :link="link" :noload="true"></add>
      <div v-if="!isActive(link.active)" class="ui dimmer transition visible active" style="display: block !important; opacity: 0.2; pointer-events: none;"></div>
    </div>
`,
  props: {
    link: Object,
    query: String,
    setquery: Function
  },
  data: function(){
    return {
      isAdd: false
    };
  },
  methods: {
    filter: function(link){
      return this.query.split(/ /).reduce(function(acc, e){
        var filter = linkFilter(e);
        return acc || filter(link);
      }, false);
    },
    addTag: function(tag){
      if(this.query === ''){
        this.query = tag;
        this.setquery(this.query);
        return;
      }
      this.query += ' ' + tag;
      this.setquery(this.query);
    },
    isActive: function(active){
      let today = new Date();
      let from = !active.from || (new Date(active.from)) <= today;
      let to = !active.to || today <= (new Date(active.to));
      return from && to;
    },
    copyMd: function(link){
      copy(`[${link.title}](${link.url})`);
      return false;
    },
    copyOrg: function(link){
      copy(`[[${link.url}][${link.title}]]`);
      return false;
    },
    ymd: ymd
  }
});
