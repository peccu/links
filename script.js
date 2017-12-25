'use strict';
var intMatch = function(target, obj, regex){
  return (target && (obj && obj.id.toString().match(regex)));
};

var nameMatch = function(target, obj, regex){
  return (target && (obj && obj.name.match(regex)));
};

var linkFilter = function(query){
  var regex = new RegExp(query, 'ig');
  if(query === ''){
    regex = null;
  }
  return function(link){
    if(!regex){return true;}
    var result = link.title.match(regex) ||
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

var filteredList = function(list, query){
  return query.split(/ /).reduce(function(acc, e){
    var filter = linkFilter(e);
    var filtered = acc.filter(filter);
    return filtered;
  }, list);
};

var zerofill = function(i){
  return ('00' + (i)).slice(-2);
};

var ensureNode = function(tree){
  if(!tree){
    tree = {
      contents: [],
      children: {}
    };
  }
  return tree;
};
var addToTree = function(tree, content, path){
  tree = ensureNode(tree);
  if(path.length == 0){

    tree.contents.push(content);
    return;
  }
  if(path.length == 1){
    tree.children[path[0]] = ensureNode(tree.children[path[0]]);

    tree.children[path[0]].contents.push(content);
    return;
  }
  var current = path[0];
  tree.children[current] = ensureNode(tree.children[current]);

  addToTree(tree.children[current], content, path.slice(1));
};

const generateTree = function(links){
  var data = {
    contents: [],
    children: {}
  };
  links.map(function(e, i, a){
    e.category.map(function(path){
      addToTree(data, e, path);
    });
  });
  return data;
};

// define the item component
Vue.component('itemOrig', {
  template: '#item-template-orig',
  props: {
    model: Object
  },
  data: function () {
    return {
      open: true
    };
  },
  computed: {
    isFolder: function () {
      return this.model.children &&
        this.model.children.length;
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

// define the item component
Vue.component('item', {
  template: '#item-template',
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

// define the item component
Vue.component('itemContent', {
  template: '#content-template',
  props: {
    link: Object,
    query: String,
    setquery: Function
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
    ymd: function(date){
      let d = new Date(date);
      return d.getFullYear() + '/'
        + zerofill(d.getMonth() + 1) + '/'
        + zerofill(d.getDate());
    }
  }
});

const mountpoint = 'app';
var app = new Vue({
  el: '#' + mountpoint,
  props: [
  ],
  components: {
  },
  computed: {
    filtered: function () {
      return filteredList(this.links, this.query);
    }
  },
  data: {
    fetched: false,
    query: '',
    links: window.links,
    treeData: generateTree(window.links),
    category: 'リンク集'
  },
  watch: {
  },
  beforeCreate: function(){
  },
  created: function(){
  },
  beforeMount: function(){
  },
  mounted: function(){
    document.getElementById(mountpoint).classList.remove('loading');
    $('.menu .item').tab();
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
    setquery: function(query){
      this.query = query;
    }
  }
});
