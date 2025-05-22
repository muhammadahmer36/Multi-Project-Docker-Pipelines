import React from 'react';
import { TFunction } from 'i18next';
import Typography from '@mui/material/Typography';
import styles from './ForgotCredentials.module.scss';

interface IHeaderProps {
  t: TFunction;
  forgetCredentials: string;
}

export default function Header({ forgetCredentials, t }: IHeaderProps) {
  return (
    <>
      <Typography
        align="center"
        className={styles.headerText}
      >
        {forgetCredentials === 'userName' ? t('forgotUserName') : t('forgotPassword')}
      </Typography>

      <Typography
        align="center"
        className={styles.messageText}
      >
        {t('pleaseEnterYour')}
        {forgetCredentials === 'userName' ? t('employeenumber.') : t('username.')}
      </Typography>
    </>
  );
}
