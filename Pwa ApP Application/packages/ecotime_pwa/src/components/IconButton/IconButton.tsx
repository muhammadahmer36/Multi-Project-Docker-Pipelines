import React, { ReactNode } from 'react';
import { IconButton, IconButtonProps } from '@mui/material';

interface ETIconFieldProps extends IconButtonProps {
  IconSize?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  className: string;
  testId: string;
  tabIndex?:number;
}

export default function StyledIconButton({
  onClick, IconSize, icon, sx, edge, className, testId, tabIndex,
}: ETIconFieldProps) {
  return (
    <div className="et2">
      <IconButton
        aria-label="Close"
        onClick={onClick}
        edge={edge}
        data-testid={testId}
        tabIndex={tabIndex}
        size={IconSize}
        sx={sx}
        className={className}
      >
        {icon}
      </IconButton>
    </div>
  );
}

StyledIconButton.defaultProps = {
  IconSize: 'small',
  icon: null,
};
