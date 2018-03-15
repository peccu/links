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
