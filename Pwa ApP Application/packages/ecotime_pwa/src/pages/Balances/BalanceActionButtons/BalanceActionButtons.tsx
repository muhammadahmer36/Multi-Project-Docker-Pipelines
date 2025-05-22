import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { balanceSearchManager, balances, firstRecord } from 'appConstants';
import managerSearch from 'assets/img/managerSearch.svg';
import leftChevron from 'assets/img/leftChevron.svg';
import rightChevron from 'assets/img/rightChevron.svg';
import { getBalanceDate, getBalanceParams } from '../selectors';
import { getBalanceForTimesheetGroups } from '../slice';
import styles from './BalanceActionButtons.module.scss';

interface Props {
  showChevronButtons: boolean
}

export default function BalanceActionButtons(props: Props) {
  const { showChevronButtons } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const balanceDate = useSelector(getBalanceDate);
  const balanceParams = useSelector(getBalanceParams);
  const { currentPageId, employeeCount } = balanceParams || {};

  const navigateToBalanceSearchManager = () => {
    navigate(balanceSearchManager);
  };

  const handleClickOnRightChevron = () => {
    const pageNumber = currentPageId === employeeCount ? firstRecord : currentPageId + 1;
    dispatch(getBalanceForTimesheetGroups({
      date: balanceDate,
      page: balances,
      navigate,
      pageid: pageNumber,
    }));
  };

  const handleClickOnLeftChevron = () => {
    const pageNumber = currentPageId === firstRecord ? employeeCount : currentPageId - 1;
    dispatch(getBalanceForTimesheetGroups({
      date: balanceDate,
      page: balances,
      navigate,
      pageid: pageNumber,
    }));
  };

  return (
    <div className={styles.buttonsContainer}>
      <Box
        className={styles.floatingContainer}
        sx={{ '& > :not(style)': { m: '2px 8px' } }}
      >
        {
          showChevronButtons
          && (
            <IconButton
              className={styles.iconPadding}
              onClick={handleClickOnLeftChevron}
            >
              <img
                src={leftChevron}
                alt="left"
              />
            </IconButton>
          )
        }
        <IconButton
          className={styles.iconPadding}
          onClick={navigateToBalanceSearchManager}
        >
          <img
            src={managerSearch}
            alt="search"
          />
        </IconButton>
        {showChevronButtons
          && (
            <IconButton
              className={styles.iconPadding}
              onClick={handleClickOnRightChevron}
            >
              <img
                src={rightChevron}
                alt="right"
              />
            </IconButton>
          )}
      </Box>
    </div>
  );
}
