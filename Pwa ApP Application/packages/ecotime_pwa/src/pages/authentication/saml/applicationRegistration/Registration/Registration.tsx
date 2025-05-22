import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useValidationSchema } from 'schemas/activeDirectory/activeDirectoryRegistration';
import {
  CompanyLogo,
  StyledTextField,
  StyledButton,
  ErrorFooter,
  Loader,
  BackDrop,
} from 'components';
import { registerSamlUser } from 'pages/authentication/saml/slice';
import { getRegistrationResponseFromMsal } from 'pages/authentication/saml/selector';
import { IRegistration } from 'pages/authentication/saml/types';
import useFlows from './hooks/useFlows';
import styles from './Registration.module.scss';

function Registration() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const validationProvider = useValidationSchema();

  const { isLoading } = useSelector(
    getRegistrationResponseFromMsal,
  );

  const {
    control, handleSubmit, formState, setValue, getValues,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      employeeNumber: '',
      employeeName: '',
      employeeEmail: '',
      userName: '',
      phone: '',
    },
  });

  const { userName } = getValues();

  const {
    serverErrorMessage,
  } = useFlows(setValue);

  const { isValid } = formState;

  const onSubmit: SubmitHandler<IRegistration> = (data) => {
    dispatch(registerSamlUser(data));
  };

  return (
    <div className={styles.registerForm}>
      <BackDrop openBackDrop={isLoading} />
      <div className={styles.container}>
        <CompanyLogo styleClass={styles.logo} />
        <Typography align="center" className={styles.registerText}>
          {t('registerYourAccount')}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formBox}
        >
          <Typography
            className={styles.greetingText}
          >
            {t('welcomePleaseRegisterYourAccount', {
              userName: userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase(),
            })}
          </Typography>
          <Controller
            name="userName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <StyledTextField
                size="small"
                value={value}
                disabled
                onChange={onChange}
                fullWidth
                label={t('userName')}
              />
            )}
          />
          <Box className={styles.spaceBetweenFields} />
          <Controller
            name="employeeNumber"
            control={control}
            render={({ field: { onChange, value } }) => (
              <StyledTextField
                size="small"
                disabled
                value={value}
                onChange={onChange}
                fullWidth
                label={t('employeeNumber')}
              />
            )}
          />
          <Box className={styles.spaceBetweenFields} />
          <Controller
            name="employeeName"
            control={control}
            render={({ field: { onChange, value } }) => (
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
          <Box className={styles.spaceBetweenFields} />
          <Controller
            name="employeeEmail"
            control={control}
            render={({ field: { onChange, value } }) => (
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
                error={!!error}
                value={value}
                helperText={error?.message}
                onBlur={onBlur}
                onChange={onChange}
                label={t('cellPhoneNumber')}
                fullWidth
                margin="normal"
                className="styledTextField"
              />
            )}
          />
          <Box className={styles.buttonMargin} />
          <StyledButton
            type="submit"
            fullWidth
            disabled={!isValid}
            variant="contained"
            className={styles.registrationButton}
          >
            {t('register')}
          </StyledButton>

          <Loader showLoader={isLoading} />

          <ErrorFooter
            fotterClass={styles.footer}
            typographyClass={styles.errorText}
            typographyText={serverErrorMessage}
          />
        </Box>
      </div>
    </div>
  );
}

export default Registration;
