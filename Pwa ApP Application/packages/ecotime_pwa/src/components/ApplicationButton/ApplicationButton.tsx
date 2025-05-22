import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

function StyledButton({ children, ...rest }: ButtonProps) {
  return <Button {...rest}>{children}</Button>;
}

export default StyledButton;
