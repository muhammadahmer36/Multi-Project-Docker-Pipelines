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
    employeeNumber: {
      validate: {
        nonWhiteSpace: (value: string) => value.trim() !== '' || t('employeeNumberIsRequired'),
        minLength: (value: string) => value.trim().length >= 1 || t('employeeNumberShouldBeAtLeastOneCharactersLong'),
        removeWhiteSpaces: (value: string) => value.includes(' ') !== true || t('removeWhiteSpacesEmployeeNumber'),
      },
    },
    password: {
      validate: {
        nonWhiteSpace: (value: string) => value.trim() !== '' || t('passwordIsRequired'),
        minLength: (value: string) => value.trim().length >= 1 || t('passwordShouldBeAtLeastOneCharactersLong'),
      },
    },
  };
};
