'use strict';
var copy = (function(){
  var copy = function(copyText, successCB){
    if(!successCB){
      successCB = function(text){
        alert("The text is on the clipboard, try to paste it!\nCopied:\n\n" + text);
      };
    }
    if(window.clipboardData){
      window.clipboardData.setData("Text", copyText);
      return;
    }
    var tmpElem=document.createElement('pre');
    tmpElem.style.position = 'absolute';
    tmpElem.style.left = '-1000px';
    tmpElem.style.top = '-1000px';
    tmpElem.innerText = copyText;
    document.body.appendChild(tmpElem);

    var range = document.createRange();
    range.selectNodeContents(tmpElem);

    var selection;
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    var success = true;
    try{
      success = document.execCommand("copy", false, null);
    }
    catch(e){
      copyToClipboardFF(copyText);
    }
    if(success){
      successCB(copyText);
      tmpElem.remove();
    }else{
      prompt('something failed in copy', copyText);
    }
  };
  return copy;
})();
