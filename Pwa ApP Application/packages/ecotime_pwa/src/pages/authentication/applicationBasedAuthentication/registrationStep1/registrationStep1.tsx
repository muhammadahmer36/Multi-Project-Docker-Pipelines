import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  CompanyLogo, StyledTextField, StyledButton, StyledIconButton, Loader,
  ErrorFooter, BackDrop, StyledLink,
} from 'components';
import {
  validateUserName, resetServerErrorTexts, removeUserInfo, removeValuesRegistrationStep2,
} from 'redux/actionCreators';
import { useValidationSchema }
  from 'schemas/applicationBasedAuthentication/registrationStep1';
import { extractStringAgainstKeyWord } from 'utilities';
import {
  registrationStep2, ValidationStatusCodes, abaConfirmCode, login,
} from 'appConstants';
import { authResponse } from '../selector';
import styles from './RegistrationStep1.module.scss';

interface IReg {
  employeeNumber: string;
}

function AbaRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validationProvider = useValidationSchema();
  const { t } = useTranslation();
  const [isLoader, setShowLoader] = useState(false);
  const [hideIfUserExist, setHideIfUserExist] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [linkText, setLinkText] = useState('');
  const { shouldUserNavigated, validation, successfullUser } = useSelector(authResponse);
  const {
    control, handleSubmit, formState, setValue,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      employeeNumber: '',
    },
  });
  const { isValid } = formState;

  const onSubmit: SubmitHandler<IReg> = (data) => {
    dispatch(validateUserName({ employeeNumber: data.employeeNumber.trim() }));
    setServerErrorMessage('');
    setLinkText('');
    setShowLoader(true);
  };

  const navigateToLogin = () => {
    navigate(login);
  };

  useEffect(() => {
    if (shouldUserNavigated) {
      setShowLoader(false);
      dispatch(removeValuesRegistrationStep2());
      navigate(registrationStep2);
    } else if (validation) {
      setShowLoader(false);
      if (validation?.statusCode
        === ValidationStatusCodes.RegistrationNotConfirm) {
        navigate(abaConfirmCode);
      } else {
        dispatch(removeUserInfo());
        if (validation?.statusCode
          === ValidationStatusCodes.AccountAlreadyExist) {
          const { lastWord, restWords } = extractStringAgainstKeyWord(validation?.statusMessage, t('errorlogInLink'));

          setHideIfUserExist(true);
          setServerErrorMessage(restWords);
          setLinkText(lastWord);
        } else {
          setLinkText('');
          setServerErrorMessage(validation?.statusMessage);
          setHideIfUserExist(false);
        }
      }
      dispatch(resetServerErrorTexts());
    }
  }, [successfullUser, validation, navigate]);

  useEffect(() => {
    setValue(
      'employeeNumber',
      successfullUser?.employeeNumber || '',
      {
        shouldValidate: successfullUser?.employeeNumber !== undefined,
        shouldDirty: successfullUser?.employeeNumber !== undefined,
      },
    );
    return () => {
      dispatch(resetServerErrorTexts());
    };
  }, []);

  return (
    <div className={styles.registerButton}>
      <BackDrop
        openBackDrop={isLoader}
      />
      <div
        className={styles.backArrowButtonBox}
      >
        <Box
          className={styles.backArrowBox}
        >
          <StyledIconButton
            IconSize="small"
            className={styles.iconButton}
            edge="start"
            testId="et-icon"
            onClick={navigateToLogin}
            icon={<ArrowBackIosIcon className={styles.backArrow} />}
          />

        </Box>
      </div>
      <Container className={styles.container}>
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
            {t('registerYourAccount')}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formBox}
          >

            <Controller
              name="employeeNumber"
              control={control}
              rules={validationProvider.employeeNumber}
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
                  label={t('employeeNumber')}
                />
              )}
            />

            <Box
              className={styles.loaderAndFootrBox}
            />
            <Box
              className={styles.spaceBetweenTextField}
            >
              <StyledButton
                type="submit"
                fullWidth
                disabled={!isValid}
                variant="contained"
                className={styles.nextButton}
              >
                {t('next')}
              </StyledButton>
              <Box className="mtRem1" />
              <Loader
                showLoader={isLoader}
              />
            </Box>

            <ErrorFooter
              fotterClass={styles.footer}
              typographyClass={styles.errorText}
              typographyText={serverErrorMessage}
              linkText={linkText}
              onClick={() => { navigateToLogin(); }}
            />
          </Box>
        </Box>

        {
          !hideIfUserExist
          && (
            <Box
              className={styles.loginLinkBox}
            >
              <Typography
                align="center"
                className={styles.loginText}
              >
                {t('alreadyHaveAnccount')}

                <StyledLink
                  className={styles.bottomLink}
                  onClick={navigateToLogin}
                  linkText={t('logIn')}
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

export default AbaRegister;
