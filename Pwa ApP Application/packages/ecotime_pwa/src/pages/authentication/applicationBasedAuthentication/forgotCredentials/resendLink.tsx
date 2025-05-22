import React from 'react';
import { TFunction } from 'i18next';
import { StyledLink } from 'components';
import Typography from '@mui/material/Typography';
import styles from './ForgotCredentials.module.scss';

interface IHeaderProps {
  t: TFunction;
  onSubmit: () => void;
}

export default function ResendLink({ t, onSubmit }: IHeaderProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Typography
      align="center"
      className={styles.resendLinkText}
    >
      {
        t('didntGetTheUserName?')
      }
      <StyledLink
        className={styles.resendLink}
        onClick={handleClick}
        linkText={t('resend')}
        variant="h2"
        component="button"
        underline="none"
      />
    </Typography>
  );
}
