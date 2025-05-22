import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  StyledButton, CompanyLogo, StyledTextField, ErrorFooter, BackDrop,
} from 'components';
import { useValidationSchema }
  from 'schemas/applicationBasedAuthentication/confirmCode';
import { confirmABAUser, resetServerErrorTexts } from 'redux/actionCreators';
import { obscureEmail, extractString } from 'utilities';
import * as authTypes from 'redux/constants/authTypes';
import * as appConstants from 'appConstants';
import { authResponse } from '../selector';
import styles from './ConfirmCode.module.scss';

interface IFormInput {
  code: string;
}

function ConfirmationCode() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverErrorMessage, setServerErrorMessage] = useState(' ');
  const [resendAgain, setResendAgain] = useState(false);
  const [linkText, setLinkText] = useState('');
  const validationProvider = useValidationSchema();
  const loginSelector = useSelector(authResponse);

  const {
    control, handleSubmit, formState,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      code: '',
    },
  });

  const { isValid } = formState;

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setServerErrorMessage('');
    setLinkText('');
    dispatch(confirmABAUser({
      employeeNumber: loginSelector?.successfullUser.employeeNumber,
      confirmationCode: data.code.trim(),
    }));
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const showHeader = () => {
    if (loginSelector?.loginToConfrmCode) {
      return (<>{t('confirmationMessageFromLogin', { email: obscureEmail(loginSelector?.successfullUser?.employeeEmail) })}</>);
    }
    if (loginSelector?.loginToConfrmCode === false) {
      return (
        <>
          {t('confirmationMessageFromRegistration', {
            empNum: loginSelector?.successfullUser?.employeeNumber,
            email: obscureEmail(loginSelector?.successfullUser?.employeeEmail),
          })}
        </>
      );
    }

    return (<>{t('confirmationMessage', { email: obscureEmail(loginSelector?.successfullUser?.employeeEmail) })}</>);
  };

  const sendLink = () => {
    setServerErrorMessage('');
    dispatch({
      type: authTypes.RESEND_CODE_FOR_CONFIRM_USER,
      payload: {
        EmployeeNumber: loginSelector?.successfullUser.employeeNumber,
      },
    });
  };

  const dynamicLink = () => (
    <Typography
      align="center"
      className={styles.resendCodeMessage}
    >
      {
        !resendAgain
          ? t('didntGetTheCode?')
          : t('resendCodeMessage', {
            email: obscureEmail(loginSelector?.successfullUser?.employeeEmail),
          })
      }

      <StyledButton
        className={styles.resendAgain}
        disableRipple
        tabIndex={-1}
        onClick={sendLink}
      >
        {!resendAgain ? t('resend') : t('resendAgain')}
      </StyledButton>
    </Typography>
  );

  useEffect(() => {
    if (loginSelector?.validation?.statusCode) {
      if (loginSelector?.validation?.statusCode
        === appConstants.ValidationStatusCodes.SuccessfullRegisteration) {
        setServerErrorMessage('');
        navigate(appConstants.registrationSuccess);
      } else if (loginSelector?.validation?.statusCode
        === appConstants.ValidationStatusCodes.AccountAlreadyExist) {
        const
          { restWords, lastWord } = extractString(loginSelector?.validation?.statusMessage);
        setServerErrorMessage(restWords);
        setLinkText(lastWord);
      } else {
        setLinkText('');
        setServerErrorMessage(loginSelector?.validation?.statusMessage);
      }
      dispatch(resetServerErrorTexts());
    } else if (loginSelector?.resendCodeValidation?.statusCode) {
      if (loginSelector?.resendCodeValidation?.statusCode
        === appConstants.ApiStatusCode.Success) {
        setResendAgain(true);
        setServerErrorMessage(' ');
        setLinkText('');
      } else {
        setServerErrorMessage(loginSelector?.resendCodeValidation?.statusMessage);
      }
      dispatch({ type: authTypes.RESET_RESEND_CODE });
    }
  }, [loginSelector?.validation, loginSelector?.resendCodeValidation, navigate]);

  return (
    <div className={styles.confirmationCode}>
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

          <Typography
            align="center"
            className={styles.code}
          >
            {t('entertheCodeToValidate')}
          </Typography>

          <Box
            mt={1}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={styles.boxForm}
          >
            <Typography
              align="center"
              className={styles.header}
            >
              {showHeader()}
            </Typography>
            <Box mt={1}>
              <Controller
                name="code"
                defaultValue=""
                control={control}
                rules={validationProvider.code}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <StyledTextField
                    label={t('code')}
                    helperText={error?.message}
                    size="small"
                    error={!!error}
                    onChange={onChange}
                    onBlur={onBlur}
                    name="code"
                    defaultValue={value}
                    fullWidth
                  />
                )}
              />
            </Box>
            <Box mt={2}>
              <StyledButton
                type="submit"
                fullWidth
                disabled={!isValid}
                variant="contained"
                className={styles.confirmButton}
              >
                {t('confirm')}
              </StyledButton>
            </Box>

            <Box
              mt={2}
              className={styles.dynamicLink}
            >
              {dynamicLink()}
            </Box>

            {
              serverErrorMessage === '' && (
                <Box
                  className={styles.loader}
                >
                  <CircularProgress
                    size="2rem"
                    className={styles.colorActive}
                  />
                  <BackDrop
                    openBackDrop
                  />
                </Box>
              )
            }

            <ErrorFooter
              fotterClass="flexRow justify-center aICenter mt-07rem"
              typographyClass="errorColor ffInter fW500 fsRem1"
              typographyText={serverErrorMessage}
              linkText={linkText}
              onClick={() => { navigateToLogin(); }}
            />
          </Box>
        </Box>

      </Container>
    </div>
  );
}

export default ConfirmationCode;
