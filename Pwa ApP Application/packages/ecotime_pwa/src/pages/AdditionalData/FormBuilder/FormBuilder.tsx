import React from 'react';
import { ComponentsKeys } from './constants';
import ComboBox from './ComboBox';
import RadioButton from './RadioButton';
import AutoComplete from './AutoComplete';
import TextField from './TextField';
import { IFormBuilderProps } from '../types';

function FormBuilder({
  punchDetail, control, punchTasksList,
}: IFormBuilderProps) {
  switch (punchDetail.fieldInputTypeName) {
    case ComponentsKeys.ComboBox:
      return (
        <ComboBox
          control={control}
          punchDetail={punchDetail}
          list={punchTasksList}
        />
      );
    case ComponentsKeys.RadioButton:
      return (
        <RadioButton
          punchDetail={punchDetail}
          control={control}
        />
      );
    case ComponentsKeys.AutoComplete:
      return (
        <AutoComplete
          control={control}
          punchDetail={punchDetail}
          list={punchTasksList}
        />
      );
    case ComponentsKeys.TextField:
      return (
        <TextField
          control={control}
          punchDetail={punchDetail}
        />
      );
    default:
      return null;
  }
}

export default FormBuilder;
