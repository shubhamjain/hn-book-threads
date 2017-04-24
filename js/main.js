require('whatwg-fetch');

var _ = require('lodash'),
  timeago = require('timeago.js');

var tableTemplate = '<table class="uk-table uk-table-hover hbt-table">' +
    '<thead>' +
        '<tr>' +
            '<th class="uk-text-center">Title</th>' +
            '<th>Created At</th>' +
            '<th class="uk-text-center">Points</th>' +
            '<th class="uk-text-center">Comments</th>' +
        '</tr>' +
    '</thead>' +
  '<tbody>' +
    '{tableData}' +
  '</tbody>' +
'</table>';

var tableDataTemplate = '<tr>' +
  '<td>' +
      '<a href="{url}" target="_blank"><div class="cursor-pointer">{title}</div></a>' +
  '</td>' +
  '<td>{timeago}</td>' +
  '<td class="uk-text-center">{points}</a></td>' +
  '<td class="uk-text-center">{comments}</a></td>' +
'</tr>';

/* Nano Templates - https://github.com/trix/nano */
function nano(template, data) {
  return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
    var keys = key.split("."), v = data[keys.shift()];
    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return (typeof v !== "undefined" && v !== null) ? v : "";
  });
}

fetch('./data/threads.json').then(function(data){
  return data.json();
}).then(function(threads){

  var threadsHTML = _(threads).sortBy('points').reverse().map(function( threadJson ){
    threadJson.timeago = new timeago().format(threadJson.created_at * 1000);
    return nano(tableDataTemplate, threadJson);
  }).join(' ');

  document.getElementById("thread-table").innerHTML = nano(tableTemplate, {tableData: threadsHTML});
});