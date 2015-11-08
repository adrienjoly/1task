'use strict';

var React = require('react');
var PollForm = require('./PollForm.jsx');
var itemStore = require('./itemStore.js');

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

  shouldComponentUpdate = (nextProps, nextState) => {
    return nextProps != this.props || nextState.options != this.state.options;
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
    // UI action feedback
    this.refs.pollForm.setState({ disabled: true });
    this.props.setLoading(true);
    // submitting data
    console.log('Saving new selected items...');
    var selectedItems = this.refs.pollForm.state.selectedOptions.map((opt) => opt.name);
    console.log('Selected items:', selectedItems);
    itemStore.syncItems(selectedItems, () => {
      console.log('=>', arguments);
      console.log('Subscribing to Mailchimp newsletter...');
      this.props.onSubmit(selectedItems);
      // => will redirect to other page
      // ... or what ? (TODO)
    });
  }

};

module.exports = PersistedPollForm;
