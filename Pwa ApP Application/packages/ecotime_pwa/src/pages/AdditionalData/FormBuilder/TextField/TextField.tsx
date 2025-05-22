import React from 'react';
import { useController } from 'react-hook-form';
import { StyledTextField } from 'components';
import useMemoizedValidation from 'pages/AdditionalData/FormBuilder/core/common/hooks/useMemoizedValidation';
import { ITextFieldProps } from './types';

export default function TextField({
  punchDetail, control,
}: ITextFieldProps) {
  const {
    fieldCaption, dataTypeName, fieldRequired, fldId,
  } = punchDetail;
  const { rules } = useMemoizedValidation(fieldRequired, fieldCaption, dataTypeName);

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
    <StyledTextField
      label={fieldRequired === true ? `${fieldCaption}*` : fieldCaption}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={!!error}
      helperText={error?.message}
    />
  );
}
