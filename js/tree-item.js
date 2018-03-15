'use strict';
var filteredList = function(list, query){
  return query.split(/ /).reduce(function(acc, e){
    var filter = window.linkFilter(e);
    var filtered = acc.filter(filter);
    return filtered;
  }, list);
};

// define the item component
Vue.component('item', {
  template: `
    <div class="item" v-if="filtered.length > 0 || Object.keys(model.children).length > 0">
      <div v-if="isFolder" class="header" @click="toggle" @dblclick="changeType" style="cursor: pointer;">
        <i class="folder icon" :class="{open: isOpen}"></i>
        {{category}}
      </div>
      <div class="list" v-show="isOpen" v-if="isFolder">
        <item class="item"
              v-for="(model, category) in model.children"
              :category="category"
              :query="query"
              :setquery="setquery"
              :model="model">
        </item>
        <!-- <li class="add" @click="addChild"><i class="plus icon"></i></li> -->
      </div>
      <div class="ui divided list">
        <item-content class="item" v-show="isOpen" v-for="link in model.contents" :link="link" :query="query" :setquery="setquery"></item-content>
      </div>
    </div>
`,
  props: {
    category: String,
    query: String,
    setquery: Function,
    model: Object
  },
  data: function () {
    return {
      // default collapse/open
      open: true
    };
  },
  computed: {
    filtered: function () {
      return filteredList(this.model.contents, this.query);
    },
    isFolder: function () {
      return (this.model.children &&
              Object.keys(this.model.children).length) ||
        (this.model.contents &&
         this.model.contents.length);
    },
    isOpen: function () {
      return this.open || this.query !== '';
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    changeType: function () {
      return;
      if (!this.isFolder) {
        Vue.set(this.model, 'children', []);
        this.addChild();
        this.open = true;
      }
    },
    addChild: function () {
      this.model.children.push({
        name: 'new stuff'
      });
    }
  }
});
