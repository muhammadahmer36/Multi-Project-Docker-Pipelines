import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { getCookie } from 'utilities/cacheUtility';
import {
  StyledButton, CompanyLogo, StyledTextField, StyledCheckBox, StyledIconButton,
  ErrorFooter, BackDrop, Loader,
} from 'components';
import { useValidationSchema }
  from 'schemas/applicationBasedAuthentication/login';
import { loginActiveDirectoryUser } from './slice';
import { IFormActiveDirectoryLogin } from './types';
import usePolicies from './hooks/usePolicies';
import styles from './Login.module.scss';

function Login() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validationProvider = useValidationSchema();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control, handleSubmit, formState, getValues,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      userName: getCookie('userName') || '',
      password: '',
      rememberMe: Boolean(getCookie('isRemember')),
    },
  });

  const {
    linkText, serverErrorMessage, resetFields, isLoading,
  } = usePolicies(getValues());

  const { isValid } = formState;

  const onSubmit: SubmitHandler<IFormActiveDirectoryLogin> = (data) => {
    const apiData = {
      loginName: data.userName.trim(),
      password: data.password,
      deviceId: '1',
      rememberMe: data.rememberMe,
      deviceName: navigator.userAgent.replace(/\s+/g, ''),
    };
    dispatch(loginActiveDirectoryUser(apiData));
    resetFields();
  };

  const onClickLink = () => {
    navigate('/ada/registration');
  };

  return (
    <div className={styles.loginFoam}>
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
              className={styles.spaceBetweenFields}
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
                    onChange={onChange}
                    checked={value}
                    labelStyle={styles.checkBoxLabel}
                    className={styles.fillCheckBoxColor}
                  />
                )}
              />

            </Box>

            <StyledButton
              type="submit"
              fullWidth
              disabled={!isValid}
              variant="contained"
              className={styles.loginButton}
            >
              {t('submit')}
            </StyledButton>
            <Loader
              showLoader={isLoading}
            />
            <ErrorFooter
              fotterClass={styles.footer}
              typographyClass={styles.errorText}
              typographyText={serverErrorMessage}
              linkText={linkText}
              onClick={onClickLink}
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
