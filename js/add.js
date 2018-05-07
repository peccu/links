'use strict';
var mountpoint = 'add';
Vue.component('add', {
  template: `
      <form v-on:submit.prevent="onSubmit">
        <div class="ui form success error">
          <div class="field">
            <label>Title</label>
            <input placeholder="Title" type="text" v-model="link.title" @keyup.enter="onSubmit">
          </div>
          <div class="field">
            <label>URL</label>
            <input placeholder="URL" type="text" v-model="link.url" @keyup.enter="onSubmit">
          </div>
          <div class="field">
            <label>parameters</label>
            <div v-if="link.url.split('?')[1]" class="ui button" @click="clearParameters" id="clear-parameters">Clear</div>
            <input placeholder="parameters" type="text" :value="link.url.split('?')[1]" readonly>
          </div>
          <div class="field">
            <label>Description</label>
            <textarea v-model="link.description"></textarea>
          </div>
          <div class="field">
            <label>Keywords</label>
            <input placeholder="Keywords" type="text" v-model="link.keyword" @keyup.enter="onSubmit" @change="formatKeyword" autofocus>
          </div>
          <div class="field">
            <label>Category</label> <pre>aaa,bbb!ccc,ddd
↓
[["aaa","bbb"],["ccc","ddd"]]</pre>
            <input placeholder="Category" type="text" v-model="link.category" @keyup.enter="onSubmit">
          </div>
          <div class="field">
            <label>Target</label>
            <input placeholder="Target" type="text" v-model="link.target" @keyup.enter="onSubmit">
          </div>
          <div class="field">
            <label>Updated Date</label>
            <div>{{link.ts && moment.unix(link.ts/1000).calendar()}}</div>
          </div>
          <div v-if="error" class="ui error message">
            <div class="header">Something is wrong</div>
            <p>{{error}}</p>
          </div>
          <div v-if="success" class="ui success message">
            <div class="header">Completed</div>
            <p>Saving is successed.</p>
          </div>
          <div class="ui submit button" @click="onSubmit" id="submit">Save</div>
          <button v-if="success || error" class="ui submit button" @click="close" id="close">close</button>
          <div class="ui button" @click="load">reload link</div>
        </div>
      </form>
`,
  props: {
    noload: Boolean
  },
  components: {
  },
  computed: {
  },
  data: function(){
    return {
      link: {},
      linkLoaded: false,
      error: '',
      success: false
    };
  },
  watch: {
  },
  beforeCreate: function(){
  },
  created: function(){
    if(this.noload){
      return;
    }
    this.link = this.parseParam(window.location.search);
    var view = this;
    console.log('cre', this.link);
    var cb = function(){
      console.log('setup completed. Now fetching.');
      view.load(view.link.url)
        .then(function(){
          var link = view.parseParam(window.location.search);
          if(link.keyword == ''){
            return;
          }
          view.onSubmit().then(view.close);
        });
    };
    window.LinkStore.setup(cb);
    window.setTimeout(() => {
      if(view.linkLoaded){
        return;
      }
      document.getElementById(mountpoint).classList.remove('loading');
      view.error = {message: 'timeout'};
    }, 3000);
  },
  beforeMount: function(){
  },
  mounted: function(){
  },
  beforeUpdate: function(){
  },
  updated: function(){
  },
  beforeDestroy: function(){
  },
  destroyed: function(){
  },
  methods: {
    parseParam: function(search){
      var template = {
        title: '',
        url: '',
        description: '',
        keyword: '',
        category: '',
        active: {
        },
        target: '_blank'
      };
      return window.parseParameters(search, template);
    },
    clearParameters: function(event){
      this.link.url = this.link.url.split('?')[0];
      return false;
    },
    load: function(){
      console.log('fetch link', this.link.url);
      var view = this;
      return window.LinkStore.getAction(this.link.url)
        .then((link) => {
          if(link){
            console.log('fetched link', link);
            link.keyword = view.link.keyword ? _.union(view.link.keyword.split(','), link.keyword).join(',') : link.keyword.join(',');
            link.category = link.category.map((e) => e.join(',')).join('!');
            view.link = link;
          }else{
            console.log('new link');
          }
          document.getElementById(mountpoint).classList.remove('loading');
          view.linkLoaded = true;
          view.error = '';
          return link;
        })
        .catch((err) => {
          console.log('error', err);
          view.error = JSON.stringify(err);
          return err;
        });
    },
    onSubmit: function(event){
      this.link.keyword = this.link.keyword != '' ? this.link.keyword.split(',') : [];
      this.link.category = this.link.category.match(/!/) ?
        this.link.category.split('!').map((e) => e.match(/,/) ? e.split(',') : [e]) :
        [this.link.category.match(/,/) ? this.link.category.split(',') : [this.link.category]];
      this.link.ts = new Date().getTime().toString();
      document.getElementById('submit').classList.add('loading');
      var view = this;
      return window.LinkStore.addLinksAction(this.link)
        .then(() => {
          console.log('success in onSubmit');
          document.getElementById('submit').classList.remove('loading');
          view.link.keyword = view.link.keyword.join(',');
          view.link.category = view.link.category.map((e) => e.join(',')).join('!');
          view.success = true;
          Vue.nextTick(function(){
            document.getElementById('close').focus();
          });
        })
        .catch((err) => {
          document.getElementById('submit').classList.remove('loading');
          view.error = JSON.stringify(err);
        });
    },
    formatKeyword: function(event){
      this.link.keyword = _.toLower(this.link.keyword.replace(/ *, */g, ','));
    },
    close: function(event){
      window.close();
    }
  }
});
