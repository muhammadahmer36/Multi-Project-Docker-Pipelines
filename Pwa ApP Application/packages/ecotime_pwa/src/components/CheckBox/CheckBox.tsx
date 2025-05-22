import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import './CheckBox.scss';
/* eslint-disable no-unused-vars */
interface CheckboxLabelsProps {
  label?: string;
  disabled: boolean;
  checked: boolean;
  labelStyle?: string;
  className?: string;
  tabIndex?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export default function StyledCheckBox({
  label, disabled, checked, onChange, className, labelStyle, tabIndex, onBlur,
}: CheckboxLabelsProps) {
  return (
    <FormGroup>
      <FormControlLabel
        control={(
          <Checkbox
            tabIndex={tabIndex}
            disabled={disabled}
            checked={checked}
            onBlur={onBlur}
            onChange={onChange}
            className={className}
          />
        )}
        label={<Typography className={labelStyle}>{label}</Typography>}
        disabled={disabled}
      />
    </FormGroup>
  );
}
