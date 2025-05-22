import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { getInitialsOfFirstAndLastName } from 'utilities';
import styles from './EmployeeInformation.module.scss';

interface Props {
  employeeName?: string;
  paginationInformation?: React.ReactNode
}

export default function EmployeeInformation(props: Props) {
  const { employeeName, paginationInformation } = props;
  return (
    <div className={styles.employeeInformation}>
      <Box className={styles.greetingBox} mb={1.5}>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Avatar
            className={styles.avatar}
          >
            {employeeName && getInitialsOfFirstAndLastName(employeeName)}
          </Avatar>
          <Box mt={0.6} ml={1.5}>
            <Typography
              className={styles.greetingMessage}
            >
              {employeeName}
            </Typography>
          </Box>
        </Box>
        {paginationInformation}
      </Box>
    </div>
  );
}
