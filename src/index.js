(function(){
  'use strict';
  
  var React = require('react');
  var ReactDOM = require('react-dom');
  var PollForm = require('./PollForm.js');
  var itemStore = require('./itemStore.js');

  // TODO: minify compiled bundle (e.g. use uglify), for production

  // ___
  // UI code

  // Needed for React Developer Tools
  window.React = React;

  function getSelectedItems(form) {
    var selected = [];
    for (var i=0; i<form.elements.length; ++i) {
      if (form.elements[i].name == 'selected' && form.elements[i].checked) {
        selected.push(form.elements[i].value);
      }
    }
    return selected;
  }

  function setLoading(toggle) {
    document.body.className = (document.body.className || '').replace(/is\-loading/, '');
    if (toggle) {
      document.body.className += ' is-loading';
    }
  }

  function renderApp(options) {
    console.log('renderApp with options:', options);
    var element = React.createElement(PollForm, {
      options: options || [],
      onValidSubmit: function onSubmit() {
        var form = document.getElementsByTagName('form')[0];
        var selectedItems = getSelectedItems(form);
        // TODO: disable form
        setLoading(true);
        itemStore.syncItems(selectedItems, function() {
          document.getElementById('js-merged-problems').value = selectedItems.join('\n');
          //return form.submit();
          /*
          // AJAX code for testing with devtools' network tab:
          var xhr = new XMLHttpRequest;
          xhr.open('POST', '/', true);
          xhr.send(new FormData(form));
          */
        });
      }
    });
    var appDiv = document.getElementById('app');
    return ReactDOM.render(element, appDiv, function() {
      setLoading(false);
      appDiv.style.maxHeight = appDiv.childNodes[0].clientHeight + 'px';
    });
  }

  // ___
  // Main logic

  var DEFAULT_ITEMS = [
    { name: 'Tasks accumulate too much' },
    { name: 'I don\'t know where to start' },
    { name: 'I keep postponing my deadlines' }
  ];

  console.log('Fetching options...');
  itemStore.fetchItems(function(error, items) {
    if (error) {
      renderApp();
      console.error('Fetch error:', error);
    } else {
      renderApp(items);
    }
  }, DEFAULT_ITEMS);

})();
