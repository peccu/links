'use strict';
const loader = function(queue, cb){
  var item = queue.shift();
  var script = document.createElement("script");
  document.getElementsByTagName("head")[0].appendChild(script);
  // console.log(src + ' start ' + new Date().getTime());
  script.onload = function(){
    // console.log(src + ' loaded ' + new Date().getTime());
    if(queue.length){
      return loader(queue, cb);
    }
    // console.log('all loaded');
    return cb();
  };
  script.src = item.src + (item.useCache ? '' : "?ts=" + new Date().getTime());
};
const isLocal = location.protocol == 'file:';
const vendorDir = 'vendor/js/';

const loadFrom = function(from){
  const parallel = [
    {src: (isLocal ? from + vendorDir : '//cdn.jsdelivr.net/npm/vue@2/dist/') + 'vue.min.js', useCache: true},
    {src: (isLocal ? from + vendorDir : '//momentjs.com/downloads/') + 'moment.min.js', useCache: true},
    {src: (isLocal ? from + vendorDir : '//cdn.jsdelivr.net/npm/remotestoragejs@1.0.2/release/') + 'remotestorage.min.js', useCache: true},
    {src: (isLocal ? from + vendorDir : '//cdn.jsdelivr.net/npm/remotestorage-widget@1.3.0/build/') + 'widget.min.js', useCache: true},
    {src: (isLocal ? from + vendorDir : '//cdn.jsdelivr.net/npm/jquery@3/dist/') + 'jquery.min.js', useCache: true},
    {src: (isLocal ? from + vendorDir : '//cdn.jsdelivr.net/npm/marked/') + 'marked.min.js', useCache: true},
    {src: (isLocal ? from + vendorDir : '//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/') + 'highlight.min.js', useCache: true},
    {src: (isLocal ? from + vendorDir : '//cdn.jsdelivr.net/npm/lodash@4.17.5/') + 'lodash.min.js', useCache: true}
  ];
  var finish = parallel.length;
  const queue = [
    {src: (isLocal ? from + vendorDir : '//cdn.jsdelivr.net/npm/semantic-ui@2/dist/') + 'semantic.min.js', useCache: true},
    {src: from + 'md5.js', useCache: false},
    {src: from + 'rs.js', useCache: false},
    {src: from + 'js/moment.js', useCache: false},
    {src: from + 'js/url.js', useCache: false},
    {src: from + 'js/marked.js', useCache: false},
    {src: from + 'js/cp.js', useCache: false},
    {src: from + 'js/tree-item-content.js', useCache: false},
    {src: from + 'js/tree-item.js', useCache: false},
    {src: from + 'js/tree.js', useCache: false},
    {src: from + 'js/add.js', useCache: false},
    {src: from + 'script.js', useCache: false},
  ];

  const loadQueue = function(){
    finish -= 1;
    if(finish === 0){
      loader(queue, function(){});
    }
  };
  parallel.map(function(e, i, a){
    loader([e], loadQueue);
  });
};
