import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { UserRole } from 'common/types/types';
import styles from './HeaderTitle.module.scss';

interface Props {
  title?: string;
  userRole?: number;
  currentUserRole?: number;
}

export default function HeaderTitle(props: Props) {
  const { title, userRole, currentUserRole } = props;
  const [t] = useTranslation();
  const renderUserRole = () => (currentUserRole !== UserRole.Manager ? t('employee') : t('manager'));

  return (
    <div className={styles.header}>
      <Typography
        className={styles.title}
      >
        {title}
        {
          userRole && userRole !== UserRole.Employee
          && title && renderUserRole()
        }
      </Typography>
    </div>
  );
}
