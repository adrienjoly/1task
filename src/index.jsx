(function(){
  'use strict';
  
  var React = require('react');
  var ReactDOM = require('react-dom');
  var PersistedPollForm = require('./PersistedPollForm.js');

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

  function quote(str) {
    return '"' + str.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"') + '"';
  }

  // overrides form.submit() for merging selected items into one field, for mailchimp
  var wrappedForm = (function() {
    var form = document.getElementsByTagName('form')[0];
    form.realSubmit = form.submit;
    form.submit = function(selectedItems) {
      function fixedSubmit() {
        document.getElementById('js-merged-problems').value = selectedItems.map(quote).join(',\n');
        form.realSubmit(); // redirects to mailchimp confirmation page
        /*
        // AJAX code for testing with devtools' network tab:
        var xhr = new XMLHttpRequest;
        xhr.open('POST', '/', true);
        xhr.send(new FormData(form));
        */
      }
      analytics.identify({ email: form.elements['EMAIL'].value }, function() {
        analytics.track('Voted', { options: selectedItems }, function() {
          setTimeout(fixedSubmit, 100);
        });
      });
      setTimeout(fixedSubmit, 2000); // just in case the analytics don't respond in time (timeout)
    };
    return form;
  })();

  // ___
  // Main logic

  var appDiv = document.getElementById('app');

  function heightTransition() {
    setTimeout(function() {
      appDiv.style.maxHeight = appDiv.childNodes[0].clientHeight + 'px';
    });
  }

  var element =
    <PersistedPollForm
      defaultItems={DEFAULT_ITEMS}
      setLoading={setLoading}
      form={wrappedForm}
      onUpdate={heightTransition}
    />;

  return ReactDOM.render(element, appDiv);

})();
