import { useTranslation } from 'react-i18next';
import { blockUserWritingEmoji } from '../../utilities';

export const useValidationSchema = () => {
  const { t } = useTranslation();

  return {
    userName: {
      validate: {
        nonWhiteSpace: (value: string) => {
          if (value.trim() === '') {
            return t('userNameIsRequired');
          } if (blockUserWritingEmoji(value)) {
            return t('userNameInvalid');
          }
          return true;
        },
        minLength: (value: string) => value.trim().length >= 2 || t('usernameShouldBeAtLeastTwoCharactersLong'),
        removeWhiteSpaces: (value: string) => value.includes(' ') !== true || t('removeWhiteSpaces'),
      },
    },
    tempPassword: {
      validate: {
        nonWhiteSpace: (value: string) => value.trim() !== '' || t('temppasswordIsRequired'),
        removeWhiteSpaces: (value: string) => value.includes(' ') !== true || t('removeWhiteSpacesFromTempCode'),
      },
    },
    password: {
      validate: {
        nonWhiteSpace: (value: string) => value.trim() !== '' || t('passwordIsRequired'),
        minLength: (value: string) => value.trim().length >= 1 || t('passwordShouldBeAtLeastOneCharactersLong'),
      },
    },
    newPassword: {
      validate: {
        nonWhiteSpace: (value: string) => value.trim() !== '' || t('newPasswordIsRequired'),
        minLength: (value: string) => value.trim().length >= 1 || t('newpasswordShouldBeAtLeastOneCharactersLong'),
      },
    },
    confirmPassword: {
      validate: {
        nonWhiteSpace: (value: string) => value.trim() !== '' || t('confirmPasswordIsRequired'),
        validate: (value: string, { password }: { password: string }) => value === password || t('passwordDidntMatch'),
      },
    },
    phone: {
      pattern: {
        value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/i,
        message: t('pleaseProvideCorrectCellPhoneNumber'),
      },
    },
  };
};
