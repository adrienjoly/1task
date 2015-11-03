(function(){
  'use strict';
  
  var React = require('react');
  var ReactDOM = require('react-dom');
  var PollForm = require('./PollForm.js');

  // TODO: minify compiled bundle (e.g. use uglify), for production

  // ___
  // DB code

  var itemStore = (function() {
    Parse.initialize("HAvVzC6nFUCQDskxkOio2sdiFNuWNGi9wgmX6Nwa", "jShePeIRlyKRj4S7lQ7uuktGEQn30b4DZxX7K1pb");
    var Item = Parse.Object.extend('Item');

    function storeItem(item) {
      new Item().save(item);//.then(callback);
      return item;
    }

    function storeItems(items) {
      return items.map(storeItem);
    }

    function renderItem(item) {
      return { name: item.name || item.get('name') };
    }

    function fetchItems(callback, defaultItems) {
      new Parse.Query(Item).find({
        success: function(items) {
          items = items.map(renderItem);
          callback(null, !items.length ? storeItems(defaultItems) : items);
        },
        error: function(object, error) {
          callback(error);
        }
      });
    }


    return {
      fetchItems: fetchItems,
      syncItems: syncItems
    };

  })();


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

  function renderApp(options) {
    console.log('renderApp with options:', options);
    var element = React.createElement(PollForm, {
      options: options || [],
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
    var appDiv = document.getElementById('app');
    return ReactDOM.render(element, appDiv, function() {
      document.body.className = document.body.className.replace('is-loading', '');
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
