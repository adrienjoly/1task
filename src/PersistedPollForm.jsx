'use strict';

var React = require('react');
var PollForm = require('./PollForm.jsx');
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

class PersistedPollForm extends React.Component {

  static defaultProps: {
    defaultItems: [],
    //setLoading: null,
    //form: null
  };

  constructor(props) {
    super(props);
    this.state = {
      options: this.props.defaultItems
    };
  }

  componentWillMount = () => {
    console.log('Fetching options from Parse DB...');
    var _this = this;
    itemStore.fetchItems(function(error, items) {
      _this.props.setLoading(false);
      if (error) {
        console.error('Fetch error:', error);
      } else {
        console.log('=>', items);
        _this.setState({ options: items});
      }
    }, _this.props.defaultItems);
  }

  componentDidUpdate = () => {
    this.props.onUpdate && this.props.onUpdate.call(this, arguments);
  }

  render = () => {
    return <PollForm
      ref='pollForm'
      options={this.state.options}
      onNewOption={this.onNewOption}
      onValidSubmit={this.onValidSubmit} />;
  }

  onNewOption = (newOption) => {
    this.setState({
      options: this.state.options.concat([ newOption ])
    });
  }

  onValidSubmit = () => {
    var form = this.props.form;
    var selectedItems = getSelectedItems(form);
    this.refs.pollForm.setState({ disabled: true });
    this.props.setLoading(true);
    console.log('Saving new selected items...');
    itemStore.syncItems(selectedItems, function() {
      console.log('=>', arguments);
      console.log('Subscribing to Mailchimp newsletter...');
      form.submit(selectedItems);
      // => will redirect to other page
      // ... or what ? (TODO)
    });
  }

};
/*
PersistedPollForm.getDefaultProps = function() {
  return {
    defaultItems: [],
    setLoading: null,
    form: null
  };
};
*/
module.exports = PersistedPollForm;
