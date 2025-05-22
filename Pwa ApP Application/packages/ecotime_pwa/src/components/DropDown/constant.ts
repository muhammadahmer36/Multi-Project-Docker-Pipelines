import {
  activeColor, hoverColor, paperColor, dropDownMultiSelectColor,
} from 'appConstants/colors';

export const singleSelectPaperStyle = {
  '& .MuiAutocomplete-listbox': {
    boxSizing: 'border-box',
    '& .MuiAutocomplete-option.Mui-focused': {
      backgroundColor: `${hoverColor}`,
    },
  },
  '& .MuiAutocomplete-option[aria-selected="true"]': {
    backgroundColor: `${activeColor} !important`,
    color: `${paperColor}`,
    '&.Mui-focused': {
      backgroundColor: `${activeColor} !important`,
      color: `${paperColor}`,
    },
  },
  '& ul': {
    padding: '0 !important',
    margin: '0 !important',
  },
};

export const multipleSelectPaperStyle = {
  '& .MuiAutocomplete-listbox': {
    boxSizing: 'border-box',
    '& .MuiAutocomplete-option.Mui-focused': {
      backgroundColor: `${hoverColor}`,
    },
  },
  '& .MuiAutocomplete-option[aria-selected="true"]': {
    backgroundColor: `${dropDownMultiSelectColor} !important`,
    color: 'var(--paper)',
    '&.Mui-focused': {
      backgroundColor: `${dropDownMultiSelectColor} !important`,
      color: `${paperColor}`,
    },
  },
  '& ul': {
    padding: '0 !important',
    margin: '0 !important',
  },
};
