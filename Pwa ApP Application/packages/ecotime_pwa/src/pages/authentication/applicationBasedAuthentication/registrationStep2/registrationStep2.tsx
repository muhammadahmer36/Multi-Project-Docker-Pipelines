import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { PatternFormat } from 'react-number-format';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  CompanyLogo, StyledTextField, StyledButton, StyledIconButton, ErrorFooter, Loader, BackDrop,
} from 'components';
import {
  resetUserNavigationToStep2, registerABAUser, resetServerErrorTexts,
  setConfirmHeaderMessage, setValuesOfRegistrationStep2,
} from 'redux/actionCreators/authActions';
import { useValidationSchema }
  from 'schemas/applicationBasedAuthentication/registrationStep2';
import { extractString } from 'utilities';
import * as appConstants from 'appConstants';
import { authResponse } from '../selector';
import styles from './RegistrationStep2.module.scss';

interface IReg {
  employeeNumber: string;
  userName: string,
  password: string,
  confirmPassword: string;
  employeeEmail: string,
  phone: string,
}

function addAdaReg() {
  const [showPassword, setshowPassword] = useState(false);
  const [isLoader, setShowLoader] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const validationProvider = useValidationSchema();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const loginSelector = useSelector(authResponse);
  const {
    control, formState, setValue, handleSubmit, trigger, getValues,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      employeeNumber: '',
      employeeName: '',
      employeeEmail: '',
      userName: '',
      password: '',
      confirmPassword: '',
      phone: '',

    },
  });

  const { isValid } = formState;

  const onSubmit: SubmitHandler<IReg> = (data) => {
    const payload = {
      employeeNumber: data.employeeNumber,
      loginName: data.userName,
      confirmPassword: data.confirmPassword,
      password: data.password,
      emailAddress: data.employeeEmail,
      mobileNumber: data.phone,
      termsAndCondFlag: true,

    };
    dispatch(registerABAUser(payload));
    setServerErrorMessage('');
    setShowLoader(true);
  };

  const navigateToRegistrationStep1 = () => {
    navigate(appConstants.registrationStep1);
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const validateField = { shouldValidate: loginSelector?.fieldsDisableRegistration2 };
    setValue('employeeNumber', loginSelector?.successfullUser?.employeeNumber || '', validateField);
    setValue('employeeName', loginSelector?.successfullUser?.employeeName || '', validateField);
    setValue('employeeEmail', loginSelector?.successfullUser?.employeeEmail || '', validateField);
    setValue('userName', loginSelector?.registrationStepTwoValues?.userName || '', validateField);
    setValue('password', loginSelector?.registrationStepTwoValues?.password || '', validateField);
    setValue('confirmPassword', loginSelector?.registrationStepTwoValues?.confirmPassword || '', validateField);
    setValue('phone', loginSelector?.registrationStepTwoValues?.phone || '', validateField);
    dispatch(resetUserNavigationToStep2());
  }, []);

  useEffect(() => {
    if (loginSelector?.registeredUserResponse) {
      setShowLoader(false);
    } else if (loginSelector?.validation) {
      setShowLoader(false);
      if (loginSelector?.validation?.statusCode
        === appConstants.ValidationStatusCodes.RegistrationNotConfirm) {
        const foamValues = {
          userName: getValues().userName,
          password: getValues().password,
          confirmPassword: getValues().confirmPassword,
          phone: getValues().phone,
        };
        dispatch(setValuesOfRegistrationStep2(foamValues));
        dispatch(setConfirmHeaderMessage());
        navigate(appConstants.abaConfirmCode);
      } else if (loginSelector?.validation?.statusCode
        === appConstants.ValidationStatusCodes.AccountAlreadyExist) {
        const
          { restWords, lastWord } = extractString(loginSelector?.validation?.statusMessage);
        setServerErrorMessage(restWords);
        setLinkText(lastWord);
      } else {
        setServerErrorMessage(loginSelector?.validation?.statusMessage);
        setLinkText('');
      }
      dispatch(resetServerErrorTexts());
    }
  }, [loginSelector.registeredUserResponse, loginSelector?.validation, navigate]);

  return (
    <div
      className={styles.registerForm}
    >
      <BackDrop
        openBackDrop={isLoader}
      />
      <div
        className={styles.container}
      >
        <Box
          className={styles.backArrowBox}
        >
          <StyledIconButton
            IconSize="small"
            className={styles.iconButtonStyle}
            edge="start"
            testId="et-icon-backIconRegistration2"
            onClick={() => { navigateToRegistrationStep1(); }}
            icon={<ArrowBackIosIcon className={styles.icon} />}
          />
        </Box>
        <CompanyLogo
          styleClass={styles.logo}
        />

        <Typography
          align="center"
          className={styles.registerText}
        >
          {t('registerYourAccount')}
        </Typography>
        <Box
          component="form"
          className={styles.formBox}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="employeeNumber"
            control={control}
            render={({
              field: { onChange, value },
            }) => (
              <StyledTextField
                size="small"
                value={value}
                disabled
                onChange={onChange}
                fullWidth
                label={t('employeeNumber')}
              />
            )}
          />
          <Box className={styles.spaceBetweenText} />
          <Controller
            name="employeeName"
            control={control}
            render={({
              field: { onChange, value },
            }) => (
              <StyledTextField
                size="small"
                disabled
                value={value}
                onChange={onChange}
                fullWidth
                label={t('employeeName')}
              />
            )}
          />
          <Box className={styles.spaceBetweenText} />
          <Controller
            name="employeeEmail"
            control={control}
            render={({
              field: { onChange, value },
            }) => (
              <StyledTextField
                size="small"
                value={value}
                disabled
                onChange={onChange}
                fullWidth
                label={t('emailAddress')}
              />
            )}
          />
          <Box className={styles.spaceBetweenText} />
          <Controller
            name="userName"
            control={control}
            rules={validationProvider.userName}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <StyledTextField
                helperText={error?.message}
                size="small"
                error={!!error}
                value={value}
                disabled={loginSelector?.fieldsDisableRegistration2}
                onChange={onChange}
                onBlur={onBlur}
                fullWidth
                label={t('Username')}
              />
            )}
          />
          <Box className={styles.spaceBetweenText} />
          <Controller
            name="password"
            control={control}
            rules={validationProvider.password}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <StyledTextField
                label={t('password')}
                helperText={error?.message}
                value={value}
                disabled={loginSelector?.fieldsDisableRegistration2}
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
                    className={styles.iconButtonStyle}
                    edge="start"
                    testId="et-icon-showPasswordReg"
                    onClick={() => { setshowPassword(!showPassword); }}
                    icon={showPassword ? <Visibility /> : <VisibilityOff />}
                  />
                )}
              />
            )}
          />
          <Box className={styles.spaceBetweenText} />
          <Controller
            name="confirmPassword"
            control={control}
            rules={validationProvider.confirmPassword}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <StyledTextField
                label={t('confirmPassword')}
                helperText={error?.message}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                disabled={loginSelector?.fieldsDisableRegistration2}
                error={!!error}
                showPassword={showConfirmPassword}
                endAdornment={(
                  <StyledIconButton
                    disabled={loginSelector?.fieldsDisableRegistration2}
                    IconSize="small"
                    className={styles.iconButtonStyle}
                    testId="et-icon-showConfirmPasswordReg"
                    edge="start"
                    onClick={() => { setshowConfirmPassword(!showConfirmPassword); }}
                    icon={showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  />
                )}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            rules={validationProvider.phone}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <PatternFormat
                format="### ### ####"
                customInput={TextField}
                className="styledTextField"
                error={!!error}
                value={value}
                disabled={loginSelector?.fieldsDisableRegistration2}
                helperText={error?.message}
                onBlur={onBlur}
                onChange={onChange}
                label={t('cellPhoneNumber')}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Box className="mt8" />
          <StyledButton
            type="submit"
            fullWidth
            disabled={!isValid}
            variant="contained"
            className={styles.registerButton}
          >
            {t('register')}
          </StyledButton>
          <Loader
            showLoader={isLoader}
          />

          <ErrorFooter
            fotterClass={styles.footer}
            typographyClass={styles.errorText}
            typographyText={serverErrorMessage}
            linkText={linkText}
            onClick={() => { navigateToLogin(); }}
          />
        </Box>
      </div>
    </div>
  );
}

export default addAdaReg;
