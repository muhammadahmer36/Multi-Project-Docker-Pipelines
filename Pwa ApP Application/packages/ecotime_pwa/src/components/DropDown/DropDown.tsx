/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StyledPaper } from 'components';
import { PaperProps } from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { ListboxComponent } from './reactWindowUtils/reactWindowUtis';
import { ListboxComponent as ListBoxMultipleCheckComponent } from './reactWindowMultipleCheckUtils/reactWindowUtis';
import { IComboBoxProps, ListItem } from './types';
import './DropDown.scss';
import { multipleSelectPaperStyle, singleSelectPaperStyle } from './constant';

interface PaperComponentWrapperProps {
  paperProps: PaperProps;
  paperStyle: Record<string, any>;
}

function PaperComponentWrapper({ paperProps, paperStyle }: PaperComponentWrapperProps) {
  return <StyledPaper {...paperProps} paperStyle={paperStyle} />;
}

export default function ComboBox({
  label,
  onBlur,
  helperText,
  multipeSelectonChange,
  onChangeTextInput,
  multiple = false,
  disabled = false,
  disableCloseOnSelect = false,
  error, list, value, onChange, readOnly = false,
  loading = false,
  readOnlyInput = true,
}: IComboBoxProps) {
  const listboxComponent = multiple ? ListBoxMultipleCheckComponent : ListboxComponent;
  const isOptionEqualToValue = (option: ListItem, value: ListItem) => JSON.stringify(option.code) === JSON.stringify(value.code);

  const onChangeDropDown = (event: React.SyntheticEvent<Element, Event>, values: ListItem[] | ListItem | null) => {
    if (multiple) {
      multipeSelectonChange?.(values as ListItem[]);
    } else {
      onChange?.((values as ListItem)?.code);
    }
  };

  const paperComponent = (paperProps: PaperProps) => (
    <PaperComponentWrapper
      paperProps={paperProps}
      paperStyle={multiple === true ? multipleSelectPaperStyle : singleSelectPaperStyle}
    />
  );

  return (
    <div className="icon">
      <Autocomplete
        loading={loading}
        disableListWrap
        disableCloseOnSelect={disableCloseOnSelect}
        multiple={multiple}
        readOnly={readOnly}
        disabled={disabled}
        ListboxComponent={listboxComponent}
        options={list}
        popupIcon={<ExpandMoreIcon />}
        value={value}
        PaperComponent={paperComponent}
        onBlur={onBlur}
        renderTags={(value, getTagProps) => (
          <Box
            sx={{
              maxHeight: '132px',
              overflowY: 'scroll',
            }}
          >
            {value.map((option: ListItem, index: number) => (
              <Chip
                variant="outlined"
                label={option.description}
                {...getTagProps({ index })}
              />
            ))}
          </Box>
        )}
        isOptionEqualToValue={isOptionEqualToValue}
        onChange={onChangeDropDown}
        getOptionLabel={(option: ListItem) => option.description}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{ ...params.inputProps, readOnly: readOnlyInput }}
            className="styledTextField"
            helperText={helperText}
            value={value}
            error={error}
            label={label}
            onChange={onChangeTextInput}
            InputLabelProps={{ children: '10,000 options' }}
            sx={{
              '& .MuiAutocomplete-input': {
                textAlign: 'left',
              },
            }}
          />
        )}
        renderOption={(props, option, state) => [props, option, state] as React.ReactNode}
      />
    </div>
  );
}
