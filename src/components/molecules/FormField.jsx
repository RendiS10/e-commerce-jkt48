import React from "react";
import PropTypes from "prop-types";
import Input from "../atoms/Input";

/**
 * FormField Molecule - Input field with label and validation
 * Combines Input atom with additional form field functionality
 */
const FormField = ({
  label,
  error,
  helperText,
  required = false,
  ...inputProps
}) => {
  return (
    <Input
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      {...inputProps}
    />
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
};

export default FormField;
