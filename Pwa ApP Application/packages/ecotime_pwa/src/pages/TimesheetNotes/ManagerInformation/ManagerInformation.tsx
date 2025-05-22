import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmployeeInformation, StyledTextField } from 'components';

interface Props {
    employeeName: string
    payPeriod?: string;
}

export default function ManagerInformation(props: Props) {
  const { employeeName, payPeriod } = props;
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
          value={payPeriod || ''}
          label={t('payPeriod')}
        />
      </div>
    </div>
  );
}
