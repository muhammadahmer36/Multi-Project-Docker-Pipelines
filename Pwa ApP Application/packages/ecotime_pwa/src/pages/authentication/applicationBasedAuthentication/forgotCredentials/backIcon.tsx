import React from 'react';
import Box from '@mui/material/Box';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  StyledIconButton,
} from 'components';
import styles from './ForgotCredentials.module.scss';

type IbackIcon = {
  navigateToLogin: () => void
}

export default function BackIcon({ navigateToLogin }: IbackIcon) {
  return (
    <div
      className={styles.backArrowButtonBox}
    >
      <Box
        className={styles.backIconForm}
      >
        <StyledIconButton
          IconSize="small"
          className={styles.backIconButton}
          edge="start"
          testId="et-icon"
          onClick={navigateToLogin}
          icon={<ArrowBackIosIcon className={styles.backArrow} />}
        />
      </Box>
    </div>
  );
}
