import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { whiteSpaceRegex } from 'appConstants';

const useMemoizedValidation = (fieldRequired: boolean, fieldCaption: string, dataTypeName: string) => {
  const [t] = useTranslation();

  const rules = useMemo(() => {
    const required = fieldRequired ? t('fieldIsRequired', { field: fieldCaption }) : false;

    const numericOnlyValidation = (value: string) => {
      if (dataTypeName === 'Numeric Only' && Number.isNaN(Number(value))) {
        return t('pleaseEnterNumericCharactersOnly');
      }
      return undefined;
    };

    const removeWhiteSpaces = (value: string) => {
      const whiteSpaceValidation = whiteSpaceRegex.test(value);
      if (fieldRequired && whiteSpaceValidation) {
        return t('pleaseRemoveWhiteSpaces', { fieldCaption });
      }
      return undefined;
    };

    return {
      required,
      validate: { numericOnly: numericOnlyValidation, removeWhiteSpaces },
    };
  }, [fieldRequired, fieldCaption, dataTypeName]);

  return { rules };
};

export default useMemoizedValidation;
