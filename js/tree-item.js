'use strict';
var zerofill = function(i){
  return ('00' + (i)).slice(-2);
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
