'use strict';
var intMatch = function(target, obj, regex){
  return (target && (obj && obj.id.toString().match(regex)));
};

var nameMatch = function(target, obj, regex){
  return (target && (obj && obj.name.match(regex)));
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
        return "javascript:var keyword=window.prompt('Please input keywords.\\n(comma seperated)','keyword');window.open('" + base + "?title='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href)+(keyword?'&keyword='+keyword:''))";
      }
    },
    data: {
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
        return window.filteredList(this.state.links, this.query)
          .slice().sort((a, b) => {
            if(!b.ts){
              return -1;
            }
            if(!a.ts){
              return 1;
            }
            return b.ts - a.ts;
          });
      },
      treeData: function(){
        return window.generateTree(this.state.links);
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
