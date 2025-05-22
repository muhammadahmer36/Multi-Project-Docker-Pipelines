import React from 'react';
import Typography from '@mui/material/Typography';

interface StyledTextProps {
    className?: string;
    children: React.ReactNode;
}

export default function StyledText(props: StyledTextProps) {
  const { className, children } = props;
  return (
    <Typography className={className}>{children}</Typography>
  );
}
