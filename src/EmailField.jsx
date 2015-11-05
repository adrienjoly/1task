module.exports = (function(){
  'use strict';
  var React = require('react');
  var TextField = require('material-ui/lib/text-field');

  var REGEX = /^[a-zA-Z0-9+-_]+(\.[_a-zA-Z0-9+]+)*@[a-zA-Z0-9+-_]+(\.[a-zA-Z0-9+-_]+)*(\.[a-zA-Z]+)$/;

  return class EmailField extends React.Component {

    getInitialState() {
      return {
        forceHint: false,
        value: '',
        focus: false,
        valid: false
      };
    }

    render() {
      return (
        <TextField
          type='email'
          name={this.props.name}
          valid={this.state.valid}
          aria-required={this.props.required}
          hintText={this.props.hintText}
          errorText={this._hasToShowHint() ? 'Please enter a valid email address' : ''}
          onChange={this._handleChange}
          onEnterKeyDown={this.state.valid ? this.props.onValidSubmit : undefined}
          style={this.props.style || { margin: '20px 0' }}
        />
      );
    }

    _hasToShowHint() {
      return this.state.forceHint || (this.state.value.length && !this.state.valid);
    }

    _handleChange(evt) {
      this.setState({
        forceHint: false,
        value: evt.target.value,
        valid: REGEX.test(evt.target.value)
      }, this.props.onValidation);
    }

  };

})();