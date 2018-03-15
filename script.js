'use strict';
var intMatch = function(target, obj, regex){
  return (target && (obj && obj.id.toString().match(regex)));
};

var nameMatch = function(target, obj, regex){
  return (target && (obj && obj.name.match(regex)));
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
    if(!e.category){
      return;
    }
    e.category.map(function(path){
      addToTree(data, e, path);
    });
  });
  return data;
};

var mountpoint;
var opt;
if(window.location.pathname.match(/\/add\//)){
  mountpoint = 'add';
  console.log('mountpoint', mountpoint);
  opt = {
    el: '#' + mountpoint,
    props: [
    ],
    components: {
    },
    computed: {
      bookmarklet: function(){
        var base = location.origin + location.pathname;
        return "javascript:window.open('" + base + "?title='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href))";
      }
    },
    data: {
      link: window.parsedLink
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
    }
  };
}

if(window.location.pathname.match(/^\/links\/$/) || window.location.pathname.match(/^\/$/)){
  mountpoint = 'list';
  opt = {
    el: '#' + mountpoint,
    props: [
    ],
    components: {
    },
    computed: {
      filtered: function(){
        return window.filteredList(this.state.links, this.query);
      },
      treeData: function(){
        return generateTree(this.state.links);
      }
    },
    data: {
      fetched: false,
      query: '',
      state: window.LinkStore.state,
      category: 'リンク集',
      error: ''
    },
    watch: {
    },
    beforeCreate: function(){
    },
    created: function(){
      var view = this;
      window.LinkStore.setup(function(){
        window.LinkStore.getAllAction().then(function(){
          document.getElementById(mountpoint).classList.remove('loading');
        })
          .catch((err) => {
            document.getElementById(mountpoint).classList.remove('loading');
            view.error = JSON.stringify(err);
          });
      });
    },
    beforeMount: function(){
    },
    mounted: function(){
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
      },
      reload: function(){
        var view = this;
        document.getElementById('reload').classList.add('loading');
        window.LinkStore.getAllAction().then(function(){
          document.getElementById('reload').classList.remove('loading');
        })
          .catch((err) => {
            document.getElementById('reload').classList.remove('loading');
            view.error = JSON.stringify(err);
          });
      }
    }
  };
}

var app = new Vue(opt);

// for debug
(function () {
  var src = '//cdn.jsdelivr.net/npm/eruda';
  if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
  document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
  document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
