(function(){
  'use strict';
  
  var React = require('react');
  var ReactDOM = require('react-dom');
  var PollForm = require('./PollForm.js');

  // TODO: minify compiled bundle (e.g. use uglify), for production

  // Needed for React Developer Tools
  window.React = React;

  var appDiv = document.getElementById('app');

  function getSelectedItems(form) {
    var selected = [];
    for (var i=0; i<form.elements.length; ++i) {
      if (form.elements[i].name == 'selected' && form.elements[i].checked) {
        selected.push(form.elements[i].value);
      }
    }
    return selected;
  }

  var pollForm = React.createElement(PollForm, {
    options: [
      { name: 'Tasks accumulate too much' },
      { name: 'I don\'t know where to start' },
      { name: 'I keep postponing my deadlines' }
      // TODO: persist user-generated problems, or re-use by other users
    ],
    onValidSubmit: function onSubmit() {
      var form = document.getElementsByTagName('form')[0];
      document.getElementById('js-merged-problems').value = getSelectedItems(form).join('\n');
      form.submit();
      /* AJAX code for testing with devtools' network tab:
      var xhr = new XMLHttpRequest;
      xhr.open('POST', '/', true);
      xhr.send(new FormData(form));
      */
    }
  });

  // Render the main app react component into the app div.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  ReactDOM.render(pollForm, appDiv);

})();
