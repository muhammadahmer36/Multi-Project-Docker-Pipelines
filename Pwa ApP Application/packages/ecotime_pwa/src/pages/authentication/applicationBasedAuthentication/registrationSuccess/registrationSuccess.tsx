import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  StyledButton, RegistrationSuccessImage, ErrorFooter, Loader, BackDrop,
} from 'components';
import {
  loginUser, resetServerErrorTexts, resetFlow, removeUserInfo, removeValuesRegistrationStep2,
} from 'redux/actionCreators';
import { setSession } from 'utilities';
import * as appConstants from 'appConstants';
import { authResponse } from '../selector';
import styles from './RegistrationSuccess.module.scss';

function RegistrationSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoader, setShowLoader] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const loginSelector = useSelector(authResponse);

  const onConfirm = () => {
    if (loginSelector?.loginToConfrmCode) {
      setShowLoader(true);
      dispatch(loginUser(loginSelector?.loginData));
    } else {
      dispatch(removeValuesRegistrationStep2());
      dispatch(removeUserInfo());
      navigate(appConstants.login);
    }
  };

  const checkRemember = () => {
    localStorage.setItem('userName', loginSelector?.loginData?.loginName);
    localStorage.setItem('isRemember', 'true');
  };

  useEffect(() => {
    if (loginSelector?.token) {
      setShowLoader(false);
      dispatch(resetFlow());
      if (loginSelector?.loginData?.rememberMe) {
        checkRemember();
      }
      setSession({
        token: loginSelector?.token,
        refreshToken: loginSelector?.refreshToken,
        userName: loginSelector?.userName,
      });
      navigate(appConstants.dashboard);
    } else if (loginSelector?.validation) {
      setServerErrorMessage(loginSelector?.validation?.statusMessage);
      setShowLoader(false);
      dispatch(resetServerErrorTexts());
    }
  }, [loginSelector.token, loginSelector?.validation, navigate]);

  return (
    <div className={styles.registerSuccess}>
      <BackDrop
        openBackDrop={isLoader}
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
            showLoader={isLoader}
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
            className={styles.button}
          >
            {loginSelector?.loginToConfrmCode === true ? t('next') : t('logIn')}
          </StyledButton>
        </Box>
      </Container>
    </div>
  );
}

export default RegistrationSuccess;
