import React from 'react';
import Backdrop from '@mui/material/Backdrop';

type backLoader = {
  openBackDrop: boolean;
}

function BackDrop({ openBackDrop }: backLoader) {
  return (
    <Backdrop
      className="colorBackDrop"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openBackDrop}
    />
  );
}

export default BackDrop;
