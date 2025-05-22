import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { StyledPaper } from 'components';
import { ListboxComponent } from 'components/DropDown/reactWindowUtils/reactWindowUtis';
import { IComboBoxProps, ListItem } from 'components/DropDown/types';
import { singleSelectPaperStyle } from 'components/DropDown/constant';
import { PaperProps } from '@mui/material/Paper';

interface PaperComponentWrapperProps {
  paperProps: PaperProps;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  paperStyle: Record<string, any>;
}

function PaperComponentWrapper({ paperProps, paperStyle }: PaperComponentWrapperProps) {
  return <StyledPaper {...paperProps} paperStyle={paperStyle} />;
}

export default function ComboBox({
  label, onBlur, helperText, error, list, value, onChange,
}: IComboBoxProps) {
  const paperComponent = (paperProps: PaperProps) => (
    <PaperComponentWrapper
      paperProps={paperProps}
      paperStyle={singleSelectPaperStyle}
    />
  );

  return (
    <div className="icon">
      <Autocomplete
        id="virtualize-demo"
        disableListWrap
        PaperComponent={paperComponent}
        ListboxComponent={ListboxComponent}
        options={list}
        onBlur={onBlur}
        onChange={(event, values) => onChange && onChange((values as ListItem)?.code)}
        getOptionLabel={(option: ListItem) => option.description}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{ ...params.inputProps, readOnly: true }}
            className="styledTextField"
            helperText={helperText}
            value={value}
            error={error}
            label={label}
            InputLabelProps={{ children: '10,000 options' }}
          />
        )}
        renderOption={(props, option, state) => [props, option, state.index] as React.ReactNode}
      />
    </div>
  );
}
