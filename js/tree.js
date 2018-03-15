'use strict';
const ensureNode = function(tree){
  if(!tree){
    tree = {
      contents: [],
      children: {}
    };
  }
  return tree;
};

const addToTree = function(tree, content, path){
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

var generateTree = function(links){
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
