module.exports = (function(){
  'use strict';
  var React = require('react');
  var PollForm = require('./PollForm.js');
  var itemStore = require('./itemStore.js');

  function getSelectedItems(form) {
    var selected = [];
    for (var i=0; i<form.elements.length; ++i) {
      if (form.elements[i].name == 'selected' && form.elements[i].checked) {
        selected.push(form.elements[i].value);
      }
    }
    return selected;
  }

  var PersistedPollForm = React.createClass({

    getDefaultProps() {
      return {
        defaultItems: [],
        setLoading: null,
        form: null
      };
    },

    getInitialState() {
      return {
        options: this.props.defaultItems
      };
    },

    componentWillMount() {
      console.log('Fetching options from Parse DB...');
      var _this = this;
      itemStore.fetchItems(function(error, items) {
        _this.props.setLoading(false);
        if (error) {
          console.error('Fetch error:', error);
        } else {
          _this.setState({ options: items});
        }
      }, _this.props.defaultItems);
    },

    render() {
      return React.createElement(PollForm, {
        ref: 'pollForm',
        options: this.state.options,
        onNewOption: this.onNewOption,
        onValidSubmit: this.onValidSubmit
      });
    },

    onNewOption(newOption) {
      this.setState({
        options: this.state.options.concat([ newOption ])
      });
    },

    onValidSubmit() {
      var form = this.props.form;
      var selectedItems = getSelectedItems(form);
      this.refs.pollForm.setState({ disabled: true });
      this.props.setLoading(true);
      itemStore.syncItems(selectedItems, function() {
        form.submit(selectedItems);
        // => will redirect to other page
        // ... or what ?
      });
    }

  });

  return PersistedPollForm;

})();
