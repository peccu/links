'use strict';
const renderer = new marked.Renderer();
renderer.code = (code, fileInfo) => {
  // https://qiita.com/59naga/items/7d46155715416561aa60
  var delimiter = ':';
  var info = fileInfo.split(delimiter);
  var language = info.shift();
  var fileName = info.join(delimiter);
  var fileTag = '';
  if (fileName) {
    fileTag = `<code class="filename">${fileName}</code>`;
  }

  // https://shuheikagawa.com/blog/2015/09/21/using-highlight-js-with-marked/
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && hljs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang ? hljs.highlight(language, code).value : code;
  // Render the highlighted code with `hljs` class.
  return `<pre>${fileTag}<code class="hljs ${language}">${highlighted}</code></pre>`;
};

// Set the renderer to marked.
marked.setOptions({
  renderer
});
