import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {
  StyledButton, CompanyLogo, StyledTextField, StyledIconButton, ErrorFooter,
} from 'components';
import { useValidationSchema }
  from 'schemas/applicationBasedAuthentication/registrationStep2';
import * as authTypes from 'redux/constants/authTypes';
import { ValidationStatusCodes } from 'appConstants';
import { extractString } from 'utilities';
import { authResponse } from '../selector';
import styles from './PasswordExpired.module.scss';

interface IFormInput {
  password: string;
  confirmPassword: string;
}

function PasswordExpired() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPass, setShowConfirmPass] = useState(false);
  const dispatch = useDispatch();
  const validationProvider = useValidationSchema();
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [linkText, setLinkText] = useState('');
  const {
    control, handleSubmit, formState, getValues, trigger,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const { isValid } = formState;
  const loginSelector = useSelector(authResponse);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setServerErrorMessage(' ');
    setLinkText(' ');
    const payload = {
      ...data,
      loginName: sessionStorage.getItem('userName'),
      oldPassword: sessionStorage.getItem('password'),
      deviceId: '1',
      deviceName: navigator.userAgent.replace(/\s+/g, ''),
      domainName: '',
    };
    dispatch({ type: authTypes.PASSWORD_EXPIRE, payload });
  };

  const checkRemember = () => {
    const userName = sessionStorage.getItem('userName');
    if (userName) {
      localStorage.setItem('userName', userName);
      localStorage.setItem('isRemember', 'true');
    }
  };

  const clearExpiredPasswordSession = () => {
    ['userName', 'password', 'rememberMe'].forEach((key) => sessionStorage.removeItem(key));
  };

  const clickOnLink = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleAccountLogin = () => {
      const rememberMeValue = sessionStorage.getItem('rememberMe');
      if (rememberMeValue === 'true') {
        checkRemember();
      } else if (rememberMeValue === 'false') {
        ['userName', 'isRemember'].forEach((key) => localStorage.removeItem(key));
      }
      clearExpiredPasswordSession();
      dispatch({ type: authTypes.RESET_ACCOUNT_EXPIRE_FLOW });
      navigate('/dashboard');
    };

    const handlePasswordExpireValidation = () => {
      if (loginSelector.passwordExpireValidation?.statusCode === ValidationStatusCodes.PasswordNotExpired) {
        const { restWords, lastWord } = extractString(loginSelector?.passwordExpireValidation?.statusMessage);
        setServerErrorMessage(restWords);
        setLinkText(lastWord);
      } else {
        setServerErrorMessage(loginSelector?.passwordExpireValidation?.statusMessage);
      }
      dispatch({ type: authTypes.RESET_PASSWORD_EXPIRE });
    };

    const handleWhenRegistrationNotConfirm = () => {
      navigate('/login');
      dispatch({ type: authTypes.RESET_ACCOUNT_EXPIRE_FLOW });
    };
    if (loginSelector?.token) {
      handleAccountLogin();
    } else if (loginSelector.passwordExpireValidation?.statusCode) {
      if (loginSelector.passwordExpireValidation?.statusCode
        === ValidationStatusCodes.RegistrationNotConfirm) {
        handleWhenRegistrationNotConfirm();
      } else {
        handlePasswordExpireValidation();
      }
    }
  }, [loginSelector.passwordExpireValidation, loginSelector?.token]);

  useEffect(() => () => {
    clearExpiredPasswordSession();
  }, []);
  return (
    <div className={styles.passwordExpire}>
      <Container
        component="main"
        className={styles.container}
      >
        <Box
          className={styles.containerBox}
        >

          <CompanyLogo
            styleClass={styles.image}
          />

          <Typography
            align="center"
            className={styles.expiryText}
          >
            {t('passwordExpired')}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formBox}
          >
            <Typography
              align="center"
              className={styles.passwordText}
            >
              {t('generateNewPassword')}
            </Typography>
            <Box
              mt={2}
            >
              <Controller
                name="password"
                control={control}
                rules={validationProvider.newPassword}
                render={({
                  field: { onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <StyledTextField
                    label={t('newPassword')}
                    helperText={error?.message}
                    onChange={onChange}
                    onBlur={() => {
                      onBlur();
                      if (getValues('confirmPassword') !== '') {
                        trigger('confirmPassword');
                      }
                    }}
                    error={!!error}
                    showPassword={showPassword}
                    endAdornment={(
                      <StyledIconButton
                        IconSize="small"
                        className="colorPrimary"
                        edge="start"
                        testId="et-icon-pas"
                        onClick={() => { setShowPassword(!showPassword); }}
                        icon={showPassword ? <Visibility /> : <VisibilityOff />}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box
              className={styles.spaceBetweenText}
              mb={1.5}
            >
              <Controller
                name="confirmPassword"
                control={control}
                rules={validationProvider.confirmPassword}
                render={({
                  field: { onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <StyledTextField
                    label={t('confirmPassword')}
                    helperText={error?.message}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!error}
                    showPassword={confirmPass}
                    endAdornment={(
                      <StyledIconButton
                        IconSize="small"
                        className={styles.iconColor}
                        edge="start"
                        testId="et-icon-pas"
                        onClick={() => { setShowConfirmPass(!confirmPass); }}
                        icon={confirmPass ? <Visibility /> : <VisibilityOff />}
                      />
                    )}
                  />
                )}
              />
            </Box>

            <StyledButton
              type="submit"
              fullWidth
              disabled={!isValid}
              variant="contained"
              className={styles.nextButton}
            >
              {t('confirm')}
            </StyledButton>
            {
              serverErrorMessage === ' ' && (
                <Box
                  className={styles.loader}
                >
                  <CircularProgress
                    size="2rem"
                    className={styles.loaderColor}
                  />
                </Box>
              )
            }
            <ErrorFooter
              fotterClass={styles.footer}
              typographyClass={styles.errorText}
              typographyText={serverErrorMessage}
              linkText={linkText}
              onClick={clickOnLink}
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
}
export default PasswordExpired;
