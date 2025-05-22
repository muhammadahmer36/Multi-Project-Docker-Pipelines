import React from 'react';
import Link, { LinkProps } from '@mui/material/Link';

interface StyledLinkProps extends LinkProps {
  className?: string;
  component?: React.ElementType;
  linkText: React.ReactNode;
  disabled?: boolean;
  tabIndex?: number;

}

function StyledLink({
  className,
  onClick,
  linkText,
  variant,
  tabIndex,
  disabled,
  component = 'button',
  underline,
}: StyledLinkProps) {
  return (
    <Link
      disabled={disabled}
      component={component}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      variant={variant}
      underline={underline}
    >
      {linkText}
    </Link>
  );
}

export default StyledLink;
