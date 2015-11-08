module.exports = (function(){
  'use strict';
  var React = require('react');
  var RaisedButton = require('material-ui/lib/raised-button');
  var injectTapEventPlugin = require('react-tap-event-plugin');
  var EmailField = require('./EmailField.jsx');
  var Poll = require('react-1poll');

  // Needed for onTouchTap
  // Can go away when react 1.0 release, cf https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  return class PollForm extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        disabled: false,
        hasSelectedOptions: false,
        validEmail: false
      };
    }

    render = () => {
      return (
        <div className='react-poll-form'>
          <p>What's the biggest problem(s) that prevent you from being more productive using ToDo-lists?</p>
          <Poll
            options={this.props.options}
            labelStyle={{ color: 'auto' }}
            onNewOption={this.props.onNewOption}
            onSelectionChange={this.onSelectionChange}
          />
          <div style={{ display: this.state.hasSelectedOptions ? 'block' : 'none' }}>
            <p>We'll let you know when we've solved these problems:</p>
            <EmailField
              ref='email'
              name='EMAIL' // as expected by mailchimp
              hintText='Email'
              required={true}
              onValidation={this.onEmailValidation}
              style={{
                display: 'block', // to fill the parent div's width
                width: 'auto',
                marginBottom: '16px'
              }}
            />
            <RaisedButton
              disabled={this.state.disabled}
              label='Submit'
              primary={true}
              backgroundColor='#00a651'
              style={{
                display: 'block', // to fill the parent div's width
              }}
              onTouchTap={this.state.validEmail ? this.props.onValidSubmit : this.onInvalidSubmit}
            />
          </div>
        </div>
      );
    }

    onInvalidSubmit = () => {
      this.refs.email.setState({ forceHint: true });
    }

    onEmailValidation = () => {
      this.setState({ validEmail: this.refs.email.state.valid });
    }

    onSelectionChange = (selectedOptions) => {
      this.setState({ hasSelectedOptions: selectedOptions.length > 0 });
      this.props.onSelectionChange && this.props.onSelectionChange(selectedOptions);
    }

  }

})();
