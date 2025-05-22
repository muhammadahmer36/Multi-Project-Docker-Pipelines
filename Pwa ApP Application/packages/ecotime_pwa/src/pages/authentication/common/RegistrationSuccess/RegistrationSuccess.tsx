import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackDrop, ErrorFooter, Loader, RegistrationSuccessImage, StyledButton,
} from 'components';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './RegistrationSucces.module.scss';

interface RegistrationSuccessProps {
    isLoading: boolean;
    serverErrorMessage: string;
    onConfirm: () => void
}

export default function RegistrationSuccess({ isLoading, serverErrorMessage, onConfirm }: RegistrationSuccessProps) {
  const [t] = useTranslation();
  return (
    <div className={styles.registerSuccess}>
      <BackDrop
        openBackDrop={isLoading}
      />
      <Container
        component="main"
        className={styles.container}
      >
        <Box
          className={styles.containerBox}
        >
          <RegistrationSuccessImage
            styleClass={styles.registrationImage}
          />
          <Box
            className={styles.typographyBox}
          >
            <Typography
              align="center"
              className={styles.firstText}
            >
              {t('congratulations')}
            </Typography>
            <Typography
              align="center"
              className={styles.secondText}
            >
              {t('yourAccountHasBeenSuccessfullyRegistered')}
            </Typography>

            <ErrorFooter
              fotterClass={styles.footer}
              typographyClass={styles.footerText}
              typographyText={serverErrorMessage}
              linkText=""
            />
          </Box>
        </Box>
        <Box
          className={styles.loaderBox}
        >
          <Loader
            showLoader={isLoading}
          />
        </Box>
        <Box
          className={styles.buttonBox}
        >

          <StyledButton
            type="submit"
            fullWidth
            onClick={onConfirm}
            disabled={false}
            variant="contained"
            className={styles.nextButton}
          >
            {t('next')}
          </StyledButton>
        </Box>
      </Container>
    </div>
  );
}
