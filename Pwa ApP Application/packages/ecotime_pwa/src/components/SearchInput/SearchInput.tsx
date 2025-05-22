import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import StyledPaper from 'components/ListPaper';
import { ISearchInputProps, ListItem } from './types';
import { renderOption } from './utils';
import styles from './SearchInput.module.scss';

export default function StyledAutoComplete({
  label, onBlur, helperText, error, list, searchAfterNumberOfCharacters, value, onChange,
}: ISearchInputProps) {
  const filterOptions = (options: ListItem[], { inputValue }:
    { inputValue: string }) => (inputValue.length >= searchAfterNumberOfCharacters
    ? options.filter((option: ListItem) => option.description.toLowerCase().includes(inputValue.toLowerCase()))
    : []);

  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        PaperComponent={StyledPaper}
        options={list}
        filterOptions={filterOptions}
        onChange={(event, values) => onChange && onChange((values as ListItem)?.code)}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
        openOnFocus
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            value={value}
            error={error}
            helperText={helperText}
            onBlur={onBlur}
            onChange={onChange}
            className={`${styles.icon} styledTextField`}
            InputLabelProps={{ children: '10,000 options' }}
          />
        )}
        renderOption={renderOption}
      />
    </Stack>
  );
}
