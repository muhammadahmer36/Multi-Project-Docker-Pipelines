import React from 'react';
import Box from '@mui/material/Box';
import OrganizationLogo from 'assets/img/organizationlogo.svg';
import hbsLogo from 'assets/img/hbsLogo.svg';
import './Logo.scss';

type imageStyle = {
  styleClass: string
}
export default function CompanyLogo({ styleClass }: imageStyle) {
  return (
    <Box
      className={`${styleClass} imageContainer`}
    >
      <img
        src={OrganizationLogo}
        alt="Organization Logo"
      />
      <img
        src={hbsLogo}
        alt="Hbs Logo"
      />
    </Box>
  );
}
