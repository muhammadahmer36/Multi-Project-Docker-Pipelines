import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  StyledButton,
  CompanyLogo, StyledTextField, StyledCheckBox, StyledIconButton,
  ErrorFooter, BackDrop, StyledLink, Loader,
} from 'components';
import {
  loginUser, resetServerErrorTexts, setUserNameForForgotPassword,
} from 'redux/actionCreators';
import { useValidationSchema }
  from 'schemas/applicationBasedAuthentication/login';
import * as appConstants from 'appConstants';
import * as authTypes from 'redux/constants/authTypes';
import { ForgetCredentials } from './constant';
import usePolicies from './hooks/usePolicies';
import { authResponse } from '../selector';
import { IFormInput } from './types';
import styles from './Login.module.scss';

function Login() {
  const { t } = useTranslation();
  const validationProvider = useValidationSchema();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { password, userName } = ForgetCredentials;
  const [showPassword, setShowPassword] = useState(false);
  const {
    control, handleSubmit, formState, getValues,
  } = useForm<IFormInput>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      userName: localStorage.getItem('userName') || '',
      password: '',
      rememberMe: Boolean(localStorage.getItem('isRemember')),
    },
  });
  const { isValid } = formState;
  const loginSelector = useSelector(authResponse);
  const {
    resetFields, linkText, serverErrorMessage, isLoader, accounts,
  } = usePolicies(getValues());

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const apiData = {
      loginName: data.userName.trim(),
      password: data.password,
      deviceId: '1',
      deviceName: navigator.userAgent.replace(/\s+/g, ''),
    };
    dispatch(loginUser(apiData));
    resetFields();
  };

  const sendDataToRedux = (credentials: string) => {
    dispatch({
      type: authTypes.FORGET_CREDENTIALS,
      payload: credentials,
    });
  };

  const onForgotUserName = () => {
    dispatch(setUserNameForForgotPassword(''));
    sendDataToRedux(userName);
    navigate(appConstants.forgotCredentials);
  };

  const onForgotPassword = () => {
    const { userName } = getValues();
    dispatch(setUserNameForForgotPassword(userName));
    sendDataToRedux(password);
    navigate(appConstants.forgotCredentials);
  };

  const sendToReg = () => {
    dispatch(dispatch(resetServerErrorTexts()));
    navigate(appConstants.registrationStep1);
  };

  const saveLoginDataInToSession = () => {
    const { userName, password, rememberMe } = getValues();
    sessionStorage.setItem('userName', userName);
    sessionStorage.setItem('password', password);
    sessionStorage.setItem('rememberMe', rememberMe.toString());
  };

  const moveToResetScreenOnDeactivate = () => {
    dispatch({
      type: authTypes.USER_FORGOT_PASSWORD,
      forResend: false,
      payload: {
        loginName: getValues().userName.trim(),
        isAccountActivation: true,
      },
    });
    resetFields();
  };

  const clickOnLink = () => {
    if (loginSelector?.isAccountDeactivated) {
      moveToResetScreenOnDeactivate();
    } else if (loginSelector?.isAccountExpire) {
      saveLoginDataInToSession();
      navigate('/passwordExpired');
    }
  };

  return (
    <div className={styles.loginFoam}>
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
          <CompanyLogo
            styleClass={styles.image}
          />
          <Typography
            align="center"
            className={styles.heading}
          >
            {t('logInToYouraccount')}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formBox}
          >

            <Controller
              name="userName"
              defaultValue=""
              control={control}
              rules={validationProvider.userName}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <StyledTextField
                  label={t('userName')}
                  helperText={error?.message}
                  size="small"
                  error={!!error}
                  onChange={onChange}
                  onBlur={onBlur}
                  name="userName"
                  defaultValue={value}
                  fullWidth
                />
              )}
            />
            <Box
              className={styles.forgotUserNameBox}
            >
              <StyledButton
                className={styles.linkButton}
                disableRipple
                tabIndex={-1}
                onClick={onForgotUserName}
              >
                {t('forgotUserName?')}
              </StyledButton>
            </Box>
            <Box
              className={styles.gapBetweenTextField}
            >
              <Controller
                name="password"
                control={control}
                rules={validationProvider.password}
                render={({
                  field: { onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <StyledTextField
                    label={t('password')}
                    helperText={error?.message}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!error}
                    showPassword={showPassword}
                    endAdornment={(
                      <StyledIconButton
                        IconSize="small"
                        className={styles.iconButtonStyle}
                        edge="start"
                        tabIndex={-1}
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
              className={styles.rememberMeContainer}
            >

              <Controller
                name="rememberMe"
                control={control}
                render={({
                  field: { onChange, value },
                }) => (
                  <StyledCheckBox
                    label={t('rememberMe')}
                    disabled={false}
                    tabIndex={-1}
                    onChange={onChange}
                    checked={value}
                    labelStyle={styles.checkBoxLabel}
                    className={styles.fillCheckBoxColor}
                  />
                )}
              />
              <StyledButton
                className={styles.linkButton}
                disableRipple
                disabled={accounts.deactivate}
                tabIndex={-1}
                onClick={onForgotPassword}
              >
                {t('forgotPassword?')}
              </StyledButton>
            </Box>

            <StyledButton
              type="submit"
              fullWidth
              disabled={!isValid}
              variant="contained"
              className={styles.loginButton}
            >
              {t('logIn')}
            </StyledButton>
            <Loader
              showLoader={isLoader}
            />

            <ErrorFooter
              fotterClass={styles.footer}
              typographyClass={styles.errorText}
              typographyText={serverErrorMessage}
              linkText={linkText}
              onClick={clickOnLink}
            />
          </Box>
        </Box>
        {
          !(accounts.deactivate || accounts.expired)
          && (
            <Box
              className={styles.registerLinkBox}
            >
              <Typography
                align="center"
                className={styles.registerText}
              >
                {t('dontHaveAnAccount')}

                <StyledLink
                  className={styles.registerLink}
                  onClick={sendToReg}
                  tabIndex={-1}
                  linkText={t('register')}
                  variant="h2"
                  component="button"
                  underline="none"
                />

              </Typography>
            </Box>
          )
        }

      </Container>
    </div>
  );
}
export default Login;
