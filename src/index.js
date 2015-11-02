(function(){
  'use strict';
  
  var React = require('react');
  var ReactDOM = require('react-dom');
  var injectTapEventPlugin = require('react-tap-event-plugin');
  var Poll = require('react-1poll');

  // Needed for React Developer Tools
  window.React = React;

  // Needed for onTouchTap
  // Can go away when react 1.0 release, cf https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  var appDiv = document.getElementById('app');

  var props = {
    options: [
      { name: 'Tasks accumulate too much' },
      { name: 'I don\'t know where to start' },
      { name: 'I keep postponing my deadlines' }
    ],
    onSubmit: function(evt) {
      var selected = [];
      var form = document.getElementsByTagName('form')[0];
      console.log('preparing form...', form);
      for (var i=0; i<form.elements.length; ++i) {
        if (form.elements[i].name == 'selected' && form.elements[i].checked) {
          selected.push(form.elements[i].value);
        }
      }
      document.getElementById('js-merged-problems').value = selected.join('\n');
      console.log('submitting form...', form);
      form.submit();
    }
  };

  // Render the main app react component into the app div.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  ReactDOM.render(React.createElement(Poll, props), appDiv);

})();
