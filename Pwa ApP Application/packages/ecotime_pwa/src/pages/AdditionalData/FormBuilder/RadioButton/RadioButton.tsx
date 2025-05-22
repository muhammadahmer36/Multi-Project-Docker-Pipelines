import React, { useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyledCheckBox } from 'components';
import FormHelperText from '@mui/material/FormHelperText';
import styles from './RadioButton.module.scss';
import { IRadioButtonProps } from './types';

export default function RadioButton({
  punchDetail, control,
}: IRadioButtonProps) {
  const [t] = useTranslation();
  const { fieldRequired, fieldCaption, fldId } = punchDetail;

  const required = useMemo(() => {
    const required = fieldRequired ? t('fieldIsRequired', { field: fieldCaption }) : false;
    return required;
  }, [fieldRequired, fieldCaption, t]);

  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name: `${fieldCaption}${fldId}`,
    control,
    defaultValue: false,
    rules: {
      required,
    },
  });

  return (
    <div className={styles.radioButton}>
      <StyledCheckBox
        disabled={false}
        checked={field.value}
        labelStyle={styles.checkBoxLabel}
        className={styles.fillCheckBoxColor}
        label={fieldRequired === true ? `${fieldCaption}*` : fieldCaption}
        onChange={field.onChange}
        onBlur={field.onBlur}
      />
      <FormHelperText className={styles.errorColor}>
        {fieldError?.message}
      </FormHelperText>
    </div>
  );
}
