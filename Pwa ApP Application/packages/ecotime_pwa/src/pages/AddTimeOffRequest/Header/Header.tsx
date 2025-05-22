import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { StyledLink } from 'components';
import { balances } from 'appConstants';
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined';
import Typography from '@mui/material/Typography';
import styles from './Header.module.scss';

type HeaderProps = {
  heading: string;
};

function BalanceLinkWithIcon({ balanceText }: { balanceText: string }) {
  return (
    <div className={styles.linkNode}>
      <TimelapseOutlinedIcon />
      <Typography className={styles.headerText}>{balanceText}</Typography>
    </div>
  );
}

export default function Header(props: HeaderProps) {
  const { heading } = props;
  const [t] = useTranslation();
  const navigate = useNavigate();

  const navigateToBalanceScreen = () => {
    navigate(balances);
  };

  return (
    <div className={styles.header}>
      <Typography className={styles.headerText}>{heading}</Typography>
      <StyledLink
        className={styles.balanceLink}
        onClick={navigateToBalanceScreen}
        linkText={<BalanceLinkWithIcon balanceText={t('balances')} />}
        variant="h2"
        component="button"
        underline="none"
      />
    </div>
  );
}
