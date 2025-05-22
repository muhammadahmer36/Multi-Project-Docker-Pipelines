/* eslint-disable @typescript-eslint/no-explicit-any */
import Paper from '@mui/material/Paper';

function StyledPaper(props: any) {
  const { children, paperStyle } = props;
  return (
    <Paper
      sx={paperStyle}
    >
      {children}
    </Paper>
  );
}

export default StyledPaper;
