/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmployeeInformation, StyledTextField } from 'components';

interface Props {
  employeeName: string
  date: string;
}

export default function ManagerInformation(props: Props) {
  const {
    employeeName, date,
  } = props;
  const [t] = useTranslation();

  return (
    <div>
      <EmployeeInformation
        employeeName={employeeName}
      />
      <div
        style={{
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
        <StyledTextField
          value={date}
          label={t('date')}
        />
      </div>
    </div>
  );
}
