import React from 'react';
import { useController } from 'react-hook-form';
import { StyledAutoComplete } from 'components';
import useMemoizedValidation from 'pages/AdditionalData/FormBuilder/core/common/hooks/useMemoizedValidation';
import { IAutoCompleteProps, IEachList } from './types';

export default function AutoComplete({
  punchDetail, control, list,
}: IAutoCompleteProps) {
  const {
    fieldCaption, fieldRequired, numCharsForAutoComplete, fldId, dataTypeName,
  } = punchDetail;

  const { rules } = useMemoizedValidation(fieldRequired, fieldCaption, dataTypeName);

  const comboBoxData = list.filter((eachList: IEachList) => eachList.fldId === fldId && eachList.description !== '');

  const {
    field,
    fieldState: { error },
  } = useController({
    name: `${fieldCaption}${fldId}`,
    control,
    defaultValue: '',
    rules,
  });

  return (
    <StyledAutoComplete
      label={fieldRequired === true ? `${fieldCaption}*` : fieldCaption}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={!!error}
      helperText={error?.message}
      searchAfterNumberOfCharacters={numCharsForAutoComplete}
      list={comboBoxData}
    />
  );
}
