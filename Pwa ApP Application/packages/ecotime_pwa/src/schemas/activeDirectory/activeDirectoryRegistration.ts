import { useTranslation } from 'react-i18next';

export const useValidationSchema = () => {
  const [t] = useTranslation();

  return {
    phone: {
      pattern: {
        value: /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/i,
        message: t('pleaseProvideCorrectCellPhoneNumber'),
      },
    },
  };
};
