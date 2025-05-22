import Typography from '@mui/material/Typography';
import { primaryColor, activeColor } from 'appConstants/colors';
import { ListItem } from '../types';

export const renderOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: ListItem,
  state: { selected?: boolean },
) => (
  <Typography
    component="li"
    {...props}
    sx={{
      color: state.selected ? '#fff' : `${primaryColor}`,
      fontFamily: 'Inter',
      fontSize: '16px',
      backgroundColor: state.selected ? `${activeColor} !important` : 'transparent',
    }}
  >
    {option.description}
  </Typography>
);
