import React, { useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import StyledComboBox from './AdditionalDataComboBox';
import { IComboBoxProps, IEachList } from './types';

export default function ComboBox({
  punchDetail, control, list,
}: IComboBoxProps) {
  const [t] = useTranslation();
  const { fieldCaption, fieldRequired, fldId } = punchDetail;

  const comboBoxData = list.filter((eachList: IEachList) => eachList.fldId === fldId && eachList.description !== '');

  const required = useMemo(() => {
    const required = fieldRequired ? t('fieldIsRequired', { field: fieldCaption }) : false;
    return required;
  }, [fieldRequired, fieldCaption, t]);

  const {
    field,
    fieldState: { error },
  } = useController({
    name: `${fieldCaption}${fldId}`,
    control,
    defaultValue: '',
    rules: {
      required,
    },
  });

  return (
    <StyledComboBox
      label={fieldRequired === true ? `${fieldCaption}*` : fieldCaption}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={!!error}
      helperText={error?.message}
      list={comboBoxData}
    />
  );
}
