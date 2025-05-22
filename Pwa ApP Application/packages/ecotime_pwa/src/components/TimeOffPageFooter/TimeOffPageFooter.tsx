import React from 'react';
import { StyledButton } from 'components';
import Box from '@mui/material/Box';
import styles from './TimeOffPageFooter.module.scss';

type FooterProps = {
  primaryLabel: string;
  secondaryLabel: string;
  footerClass: string;
  shouldButtonDisable: boolean;
  handlePrimaryButton: () => void;
  handleSecondaryButton: () => void;
}

export default function TimeOffPageFooter(props: FooterProps) {
  const {
    shouldButtonDisable, primaryLabel, secondaryLabel, handlePrimaryButton, handleSecondaryButton,
    footerClass,
  } = props;

  return (
    <div className={styles.container}>
      <Box
        className={footerClass}
        sx={{ '& > :not(style)': { m: '0px 4px' } }}
      >
        <StyledButton
          type="submit"
          onClick={handlePrimaryButton}
          fullWidth
          variant="outlined"
          className={styles.cancelButton}
        >
          {primaryLabel}
        </StyledButton>
        <StyledButton
          type="submit"
          fullWidth
          onClick={handleSecondaryButton}
          disabled={shouldButtonDisable}
          variant="contained"
          className={styles.registrationButton}
        >
          {secondaryLabel}
        </StyledButton>
      </Box>
    </div>
  );
}
