(function(){
  'use strict';
  
  var React = require('react');
  var ReactDOM = require('react-dom');
  var PersistedPollForm = require('./PersistedPollForm.js');

  // TODO: minify compiled bundle (e.g. use uglify), for production

  // Needed for React Developer Tools
  window.React = React;

  var DEFAULT_ITEMS = [
    { name: 'Tasks accumulate too much' },
    { name: 'I don\'t know where to start' },
    { name: 'I keep postponing my deadlines' }
  ];

  // displays the loading animation if toggle == true
  function setLoading(toggle) {
    document.body.className = (document.body.className || '').replace(/is\-loading/, '');
    if (toggle) {
      document.body.className += ' is-loading';
    }
  }

  // overrides form.submit() for merging selected items into one field, for mailchimp
  var wrappedForm = (function() {
    var form = document.getElementsByTagName('form')[0];
    form.realSubmit = form.submit;
    form.submit = function(selectedItems) {
      document.getElementById('js-merged-problems').value = selectedItems.join('\n');
      //form.realSubmit();
      /*
      // AJAX code for testing with devtools' network tab:
      var xhr = new XMLHttpRequest;
      xhr.open('POST', '/', true);
      xhr.send(new FormData(form));
      */
    };
    return form;
  })();

  // ___
  // Main logic

  var appDiv = document.getElementById('app');

  var element = React.createElement(PersistedPollForm, {
    defaultItems: DEFAULT_ITEMS,
    setLoading: setLoading,
    form: wrappedForm
  });

  return ReactDOM.render(element, appDiv, function whenRendered() {
    appDiv.style.maxHeight = appDiv.childNodes[0].clientHeight + 'px';
  });

})();
