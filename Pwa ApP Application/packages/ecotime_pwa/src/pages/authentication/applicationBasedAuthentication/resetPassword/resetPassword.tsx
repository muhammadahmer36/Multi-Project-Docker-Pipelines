import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  CompanyLogo, StyledTextField, StyledButton, StyledIconButton, ErrorFooter, BackDrop, StyledLink,
} from 'components';
import { resetServerErrorTexts, updatePassword } from 'redux/actionCreators';
import * as authTypes from 'redux/constants/authTypes';
import { useValidationSchema }
  from 'schemas/applicationBasedAuthentication/registrationStep2';
import { obscureEmail } from 'utilities';
import * as appConstants from 'appConstants';
import styles from './ResetPassword.module.scss';
import { authResponse } from '../selector';

interface ResetPasswordFormValues {
  tempPassword: string;
  password: string;
  confirmPassword: string;
}

function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: { isAccountActivation } } = useLocation();
  const validationProvider = useValidationSchema();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPass, setShowConfirmPass] = useState(false);
  const [resendAgain, setResendAgain] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState(' ');
  const loginSelector = useSelector(authResponse);
  const {
    control, handleSubmit, formState, getValues, trigger,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      tempPassword: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { isValid } = formState;

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
    const apiPayload = {
      ...data,
      loginName: loginSelector?.userDataForUpdatePassword?.loginName,
    };
    dispatch(updatePassword(apiPayload));
    setServerErrorMessage('');
  };

  const goToBack = () => {
    const destination = loginSelector?.isAccountDeactivated
      ? appConstants.login
      : appConstants.forgotCredentials;

    navigate(destination);
    dispatch({ type: authTypes?.RESET_ACCOUNT_DEACTIVATED });
  };

  const sendLink = () => {
    setServerErrorMessage('');
    dispatch({
      type: authTypes.USER_FORGOT_PASSWORD,
      forResend: true,
      payload: {
        loginName: loginSelector?.userDataForUpdatePassword?.loginName,
        isAccountActivation,
      },
    });
  };

  const onClickLink = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault();
    sendLink();
  };

  const dynamicLink = () => (
    <Typography
      align="center"
      className={styles.resendLinkText}
    >
      {
        !resendAgain
          ? t('didntGetTheTempPassword?')
          : t('resendLinkTempPas', {
            email: obscureEmail(loginSelector?.userDataForUpdatePassword?.employeeEmail),
          })
      }
      <StyledLink
        className={styles.resendLink}
        onClick={onClickLink}
        linkText={!resendAgain ? t('resend') : t('resendAgain')}
        variant="h2"
        component="button"
        underline="none"
      />
    </Typography>
  );

  useEffect(() => {
    if (loginSelector?.validation?.statusCode) {
      if (loginSelector?.validation?.statusCode
        === appConstants.ValidationStatusCodes.UpdatePassword) {
        navigate(appConstants.login);
        dispatch({ type: authTypes.RESET_ACCOUNT_DEACTIVATED });
      } else {
        setServerErrorMessage(loginSelector?.validation?.statusMessage);
      }
      dispatch(resetServerErrorTexts());
    }
    if (loginSelector?.resendCodeValidation?.statusCode) {
      if (loginSelector?.resendCodeValidation?.statusCode
        === appConstants.ApiStatusCode.Success) {
        setServerErrorMessage(' ');
        setResendAgain(true);
        dispatch({ type: authTypes.RESET_RESEND_CODE });
      } else {
        setServerErrorMessage(loginSelector?.resendCodeValidation?.statusMessage);
        dispatch({ type: authTypes.RESET_RESEND_CODE });
      }
    }
  }, [loginSelector?.validation, loginSelector.resendCodeValidation, navigate]);

  return (
    <div className={styles.resetPassword}>
      {
        serverErrorMessage === ''
        && (
          <BackDrop
            openBackDrop
          />
        )
      }
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
            className={styles.typographyText}
          >
            {t('resetYourPassword')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formBox}
          >
            <Typography
              align="center"
              className={styles.resetMessageText}
            >
              {
                loginSelector?.userDataForUpdatePassword?.employeeEmail && (
                  <>
                    {t(
                      'resetMessage',
                      {
                        email:
                          obscureEmail(loginSelector?.userDataForUpdatePassword?.employeeEmail),
                      },
                    )}
                  </>
                )
              }
            </Typography>
            <Box mt={2}>
              <Controller
                name="tempPassword"
                control={control}
                rules={validationProvider.tempPassword}
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
                    label={t('temporaryPassword')}
                  />
                )}
              />
            </Box>
            <Box mt={2}>
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
                        className={styles.iconColor}
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
            <Box mt={2}>
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
            <Box
              className={styles.loaderBox}
            />
            <Box
              className={styles.spaceBetweenBox}
            >
              <StyledButton
                type="submit"
                fullWidth
                disabled={!isValid}
                variant="contained"
                className={styles.confirmButton}
              >
                {t('confirm')}
              </StyledButton>
              <Box className={styles.spaceBetweenBox} />
              {dynamicLink()}
              {
                serverErrorMessage === '' && (
                  <Box className={styles.loader}>
                    <CircularProgress size="2rem" className={styles.loaderColor} />
                  </Box>
                )
              }

              <ErrorFooter
                fotterClass={styles.footer}
                typographyClass={styles.errorText}
                typographyText={serverErrorMessage}
                linkText=""
              />
            </Box>
          </Box>
        </Box>
        <Box
          className={styles.backArrowBox}
        >
          <Box
            component="form"
            className={styles.arrowButton}
          >
            <StyledIconButton
              IconSize="small"
              className={styles.iconButton}
              edge="start"
              testId="et-icon"
              onClick={() => { goToBack(); }}
              icon={<ArrowBackIosIcon className={styles.backArrow} />}
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ResetPassword;
