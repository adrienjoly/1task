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
      return React.createElement('div', { className: 'react-poll-form' },
        React.createElement(Poll, {
          options: this.props.options,
          labelStyle: { color: 'auto' }
        }),
        React.createElement('p', {}, 'We\'ll let you know when we\'ve solved these problems:'),
        React.createElement('div', { className: 'mt-table--full' },
          React.createElement('div', { className: 'mt-td--centered-vertical site-user-signup__col-1' },
            React.createElement(EmailField, {
              ref: 'email',
              name: 'EMAIL', // as expected by mailchimp
              hintText: 'Email',
              required: true,
              onValidation: this.onEmailValidation,            
              style: {
                display: 'block', // to fill the parent div's width, as defined by the className above
                margin: '16px 8px',
                width: 'auto'     // adapt to parent div's width
              }
            })
          ),
          React.createElement('div', { className: 'mt-td--centered-vertical site-user-signup__col-2' },
            React.createElement(RaisedButton, {
              label: 'Submit',
              primary: true,
              backgroundColor: '#00a651',
              style: {
                display: 'block', // to fill the parent div's width, as defined by the className above
                margin: '16px 8px'
              },
              onTouchTap: this.state.validEmail ? this.props.onValidSubmit : this.onInvalidSubmit
            })
          )
        )
      );
    },

    onInvalidSubmit() {
      this.refs.email.setState({ forceHint: true });
    },

    onEmailValidation() {
      this.setState({ validEmail: this.refs.email.state.valid });
    }

  });

  return PollForm;

})();
