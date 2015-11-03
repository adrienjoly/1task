module.exports = (function(){
  'use strict';
  var React = require('react');
  var TextField = require('material-ui/lib/text-field');

  var REGEX = /^[a-zA-Z0-9+-_]+(\.[_a-zA-Z0-9+]+)*@[a-zA-Z0-9+-_]+(\.[a-zA-Z0-9+-_]+)*(\.[a-zA-Z]+)$/;

  var EmailField = React.createClass({

    getInitialState() {
      return {
        valid: false
      };
    },

    render() {
      return React.createElement(TextField, {
        type: 'email',
        name: this.props.name,
        valid: this.state.valid,
        'aria-required': this.props.required,
        hintText: this.props.hintText,
        errorText: this.state.valid ? '' : 'Please enter a valid email address',
        onChange: this._handleChange,
        onEnterKeyDown: this.state.valid ? this.props.onValidSubmit : undefined,
        style: this.props.style || { margin: '20px 0' }
      });
    },

    _handleChange(evt) {
      this.setState({ valid: REGEX.test(evt.target.value) }, this.props.onValidation);
    },

  });

  return EmailField;

})();
