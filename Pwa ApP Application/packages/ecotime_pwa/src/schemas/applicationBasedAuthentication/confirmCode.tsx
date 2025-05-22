import { useTranslation } from 'react-i18next';

export const useValidationSchema = () => {
  const { t } = useTranslation();

  return {
    code: {
      validate: {
        nonWhiteSpace: (value: string) => value.trim() !== '' || t('codeIsRequired'),
        removeWhiteSpaces: (value: string) => value.includes(' ') !== true || t('removeWhiteSpacesFromCode'),
      },
    },
  };
};
