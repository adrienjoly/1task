module.exports = (function(){
  'use strict';
  var React = require('react');
  var RaisedButton = require('material-ui/lib/raised-button');
  var injectTapEventPlugin = require('react-tap-event-plugin');
  var EmailField = require('./EmailField.js');
  var Poll = require('react-1poll');

  // Needed for onTouchTap
  // Can go away when react 1.0 release, cf https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  var PollForm = React.createClass({

    getInitialState() {
      return {
        validEmail: false,
        options: []
      };
    },

    render() {
      var paperProps = {
        style: {
          backgroundColor: 'white',
          padding: '16px',
          paddingTop: '1px'
        }
      };
      return React.createElement('div', paperProps,
        React.createElement(Poll, {
          options: this.props.options
        }),
        React.createElement(EmailField, {
          ref: 'email',
          name: 'EMAIL',
          hintText: 'Email',
          required: true,
          onValidation: this.onEmailValidation,
          style: { margin: '20px 0' }
        }),
        React.createElement(RaisedButton, {
          label: 'Submit',
          primary: true,
          style: { display: 'block' },
          onTouchTap: this.state.validEmail ? this.props.onValidSubmit : undefined
        })
      );
    },

    onEmailValidation() {
      this.setState({ validEmail: this.refs.email.state.valid });
    }

  });

  return PollForm;

})();
