import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ErrorFooter,
  CompanyLogo,
  StyledTextField,
  StyledButton,
  BackDrop,
} from 'components';
import { userForgotPass, setUserNameForForgotPassword } from 'redux/actionCreators';
import { useValidationSchema }
  from 'schemas/applicationBasedAuthentication/login';
import * as appConstants from 'appConstants';
import * as authTypes from 'redux/constants/authTypes';
import Header from './header';
import ResendLink from './resendLink';
import BackIcon from './backIcon';
import useFlows from './useFlows';
import { authResponse } from '../selector';
import { IforgotCredentials } from './types';
import styles from './ForgotCredentials.module.scss';

function ForgotCredentails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validationProvider = useValidationSchema();
  const { t } = useTranslation();
  const {
    userName, forgetCredentials,
  } = useSelector(authResponse);

  const {
    control, handleSubmit, formState, getValues,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      userName: userName || '',
    },
  });

  const {
    linkText, serverErrorMessage, setServerErrorMessage,
    setLinkText, statusCode,
  } = useFlows();

  const userNameForgotSuccess = statusCode
    === appConstants.ValidationStatusCodes.ForgotUserNameSucc;

  const { isValid } = formState;

  const resetFields = () => {
    setServerErrorMessage('');
    setLinkText('');
  };

  const dispatchForForgotPassword = (user: string) => {
    dispatch(userForgotPass({ loginName: user.trim() }));
    dispatch(setUserNameForForgotPassword(user.trim()));
  };

  const dispatchForForgotUserName = () => {
    const { userName: employeeNumber } = getValues();
    resetFields();
    dispatch({
      type: authTypes.FORGET_USER_NAME,
      payload: {
        employeeNumber,
      },
    });
  };

  const onSubmit: SubmitHandler<IforgotCredentials> = (data) => {
    if (forgetCredentials === 'userName') {
      dispatchForForgotUserName();
    } else {
      resetFields();
      dispatchForForgotPassword(data.userName);
    }
  };

  const navigateToRoute = (route: string) => {
    navigate(route);
  };

  const onClickLink = () => {
    let destination = '';
    if (statusCode === appConstants.ValidationStatusCodes.UnRegisteredUser) {
      destination = appConstants.registrationStep1;
    } else {
      destination = appConstants.login;
    }
    navigateToRoute(destination);
  };

  const navigateToLogin = () => { navigate(appConstants.login); };

  return (
    <div className={styles.forgotCredentials}>
      {
        serverErrorMessage === ''
        && (
          <BackDrop
            openBackDrop
          />
        )
      }
      <BackIcon navigateToLogin={navigateToLogin} />
      <Container
        component="main"
        className={styles.container}
      >
        <Box
          className={styles.box}
        >
          <CompanyLogo
            styleClass={styles.logo}
          />

          <Header
            t={t}
            forgetCredentials={forgetCredentials}
          />

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={styles.boxForm}
          >

            <Controller
              name="userName"
              control={control}
              rules={
                forgetCredentials === 'userName'
                  ? validationProvider.employeeNumber : validationProvider.userName
              }
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <StyledTextField
                  helperText={error?.message}
                  size="small"
                  error={!!error}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  fullWidth
                  label={
                    forgetCredentials === 'userName'
                      ? t('employeeNumber') : t('userName')
                  }
                />
              )}
            />
            <Box
              className={styles.spaceBetweenFields}
            >
              <StyledButton
                type="submit"
                fullWidth
                disabled={!isValid || userNameForgotSuccess}
                variant="contained"
                className={styles.nextButton}
              >
                {t('next')}
              </StyledButton>
              <Box className={styles.spaceBetweenFields} />
              {
                userNameForgotSuccess
                && (
                  <ResendLink
                    t={t}
                    onSubmit={dispatchForForgotUserName}
                  />
                )
              }
            </Box>
            {
              serverErrorMessage === '' && (
                <Box className={styles.boxLoader}>
                  <CircularProgress size="2rem" className={styles.loader} />
                </Box>
              )
            }

            <ErrorFooter
              fotterClass={styles.footer}
              typographyText={serverErrorMessage}
              linkText={linkText}
              typographyClass={userNameForgotSuccess
                ? `${styles.successfullMessage}` : `${styles.errorText}`}
              linkClass={
                userNameForgotSuccess
                  ? `${styles.linkColorSuccess}` : `${styles.linkColorPrimary}`
              }
              onClick={onClickLink}
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
}
export default ForgotCredentails;
