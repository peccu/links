'use strict';
var parseParameters = function(locationSearch, template){
  return locationSearch.replace(/^\?/, '').split('&').reduce(function(acc, e){
    let [ key, value ] = e.split('=');
    acc[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
    return acc;
  }, template);
};
