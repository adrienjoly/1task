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
    var _cache = []; // cache of items, as: [ { name: String } ]

    function prepareDbItem(item) {
      var dbItem = new Item();
      dbItem.set('name', item.name);
      return dbItem;
    }

    function storeItems(items, callback) {
      if (items && items.length && items.map) {
        Parse.Object.saveAll(items.map(prepareDbItem), callback);
      }
      return items;
    }

    function renderDbItem(dbItem) {
      return { name: dbItem.get('name') };
    }

    function fetchItems(callback, defaultItems) {
      new Parse.Query(Item).find({
        success: function(dbItems) {
          _cache = dbItems.length ? dbItems.map(renderDbItem) : storeItems(defaultItems);
          callback(null, _cache);
        },
        error: function(object, error) {
          callback(error);
        }
      });
    }

    function syncItems(selectedItems, callback) {
      // we store in DB only the items that have been selected and submitted at least once.
      // and we make sure to prevent duplicates.
      var itemsToStore = [];
      var indexedNames = (function indexArrayByField(items, fieldName) {
        var index = {};
        for (var i=0; i<items.length; ++i) {
          index[items[i][fieldName]] = true;
        }
        return index;
      })(_cache, 'name');
      for (var i=0; i<selectedItems.length; ++i) {
        var itemName = selectedItems[i];
        var itemIsStored = indexedNames[itemName];
        if (!itemIsStored) {
          console.log('storing new item from selected options:', itemName);
          itemsToStore.push({ name: itemName });
        }
      }
      storeItems(itemsToStore, callback);
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
        var selectedItems = getSelectedItems(form);
        // TODO: disable form
        itemStore.syncItems(selectedItems, function() {
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
