import { useTranslation } from 'react-i18next';

export const useValidationSchema = () => {
  const { t } = useTranslation();

  return {
    employeeNumber: {
      validate: {
        nonWhiteSpace: (value: string) => value.trim() !== '' || t('employeeNumberIsRequired'),
        minLength: (value: string) => value.trim().length >= 1 || t('employeeNumberShouldBeAtLeastOneCharactersLong'),
        removeWhiteSpaces: (value: string) => value.includes(' ') !== true || t('removeWhiteSpacesEmployeeNumber'),
      },
    },
  };
};
