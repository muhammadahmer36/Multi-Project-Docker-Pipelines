import React from 'react';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getRegistrationResponseFromMsal } from 'pages/authentication/saml/selector';
import authenticationFailedImage from 'assets/img/authenticationFailed.svg';
import styles from './Authentication.module.scss';

function AuthenticationFailure() {
  const { validation } = useSelector(getRegistrationResponseFromMsal);
  return (
    <div className={styles.authFailure}>
      <Container component="main" className={styles.container}>
        <Box className={styles.containerBox}>
          <img
            src={authenticationFailedImage}
            alt="Success"
            className={styles.registrationImage}
          />
          <Box className={styles.typographyBox}>
            <Typography align="center" className={styles.secondText}>
              {validation.statusMessage}
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default AuthenticationFailure;
