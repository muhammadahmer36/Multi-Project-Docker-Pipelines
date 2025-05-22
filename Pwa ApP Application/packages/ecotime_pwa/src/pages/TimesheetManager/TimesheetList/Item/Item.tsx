import { ButtonBase } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { timesheet } from 'appConstants';
import approved from 'assets/img/approved.svg';
import certified from 'assets/img/certified.svg';
import notes from 'assets/img/note.svg';
import { setSelectedTimsheet } from 'pages/TimesheetManager/slice';
import { EmployeeDetail } from 'pages/TimesheetManager/types';
import {
  ChangeEvent, useContext, useEffect, useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { primaryColor } from 'appConstants/colors';
import { getTimesheetList } from 'pages/Timesheet/slice';
import { getTimesheetWeeklyList } from 'pages/TimesheetWeekly/slice';
import { getPayPeriod } from 'pages/TimesheetManager/selectors';
import Header from '../Header';
import { ListContext } from '../List/List';
import styles from './Item.module.scss';

interface Props {
  item: EmployeeDetail;
  index: number;
}
export default function Item(props: Props) {
  const {
    item,
    index,
  } = props;
  const {
    employeeName,
    completeStatus_Code: completeStatus,
    approveStatus_Code: approveStatus,
    notesCount,
  } = item;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [t] = useTranslation();
  const {
    setSize,
    setCheckedItems,
    checkedItems,
  } = useContext(ListContext);
  const root = useRef<HTMLDivElement>(null);
  const payPeriod = useSelector(getPayPeriod);

  useEffect(() => {
    if (root && root.current) {
      setSize(index, root.current.getBoundingClientRect().height);
    }
  }, [index]);

  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index] || false;
    setCheckedItems(newCheckedItems);
  };

  const onItemClick = () => {
    dispatch(setSelectedTimsheet(item));
    navigate(timesheet);
    dispatch(getTimesheetList({
      periodIdentity: Number(payPeriod.code),
      employeeNumber: Number(item.empNo),
    }));
    dispatch(getTimesheetWeeklyList({
      periodIdentity: Number(payPeriod.code),
      employeeNumber: Number(item.empNo),
    }));
  };

  return (
    <div
      ref={root}
    >
      {index === 0
        && (
          <Header />
        )}
      <ButtonBase
        sx={{
          width: '100%',
        }}
        disableRipple
        disableTouchRipple
        onClick={onItemClick}
      >
        <Grid
          container
          className={styles.container}
        >
          <Grid
            container
            className={styles.grid}
          >
            <Grid
              item
              xs={1.5}
              md={1.5}
              lg={1.5}
              className={styles.checkBoxContainer}
            >
              <Checkbox
                disableRipple
                disableTouchRipple
                disableFocusRipple
                checked={checkedItems[index]}
                onChange={handleChange}
                onClick={(event) => event.stopPropagation()}
                sx={{
                  padding: '0 !important',
                  color: `${primaryColor}`,
                  '&.Mui-checked': {
                    color: `${primaryColor}`,
                  },

                }}
              />
            </Grid>
            <Grid
              item
              xs={2.5}
              md={2.5}
              lg={2.5}
              className={styles.label}
            >
              {`${t('Name')}:`}

            </Grid>
            <Grid
              item
              xs={5}
              md={5}
              lg={5}
              className={styles.value}
            >
              {employeeName}

            </Grid>
            <Grid
              item
              xs={3}
              md={3}
              lg={3}
              className={styles.statusContainer}
            >
              {completeStatus
        && (
        <img
          src={certified}
          alt="certified"
          className={styles.image}
        />
        )}
              {approveStatus
        && (
        <img
          src={approved}
          alt="approved"
          className={styles.image}
        />
        )}
              {notesCount > 0
            && (
            <img
              src={notes}
              alt="view notes"
              className={styles.image}
            />
            )}

            </Grid>
            <Grid />
          </Grid>
        </Grid>
      </ButtonBase>
    </div>

  );
}
