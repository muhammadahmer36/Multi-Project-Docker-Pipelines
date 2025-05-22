import React from 'react';
import {
  StandardTextFieldProps,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import './ApplicationTextField.scss';

interface StyledTextFieldProps extends StandardTextFieldProps {
  showPassword?: boolean;
  multiline?: boolean;
  rows?: number;
  endAdornment?: React.ReactElement;
  contentEditable?: boolean
}

export default function StyledTextField({
  onChange, label, showPassword = true, endAdornment, multiline, rows,
  helperText, error, onBlur, value, disabled, defaultValue, contentEditable,
}: StyledTextFieldProps) {
  return (
    <TextField
      contentEditable={contentEditable}
      onChange={onChange}
      label={label}
      onBlur={onBlur}
      value={value}
      disabled={disabled}
      className="styledTextField"
      error={error}
      rows={rows}
      multiline={multiline}
      defaultValue={defaultValue}
      helperText={helperText}
      type={showPassword === false ? 'password' : 'text'}
      fullWidth
      InputProps={{
        endAdornment,
      }}
    />
  );
}

StyledTextField.defaultProps = {
  showPassword: true,
  endAdornment: null,

};
