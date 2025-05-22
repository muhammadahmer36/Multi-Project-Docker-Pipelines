import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import { ListContext } from 'components/ReactWindowList/ReactWindowList';
import { convertStringIntoDayJsDate, formatsMapper, getDateAgainstFormat } from 'core/utils';
import { TimeOffRequestItemDetail } from 'pages/TimeOffCalendar/types';
import { durationConvertionInDeciamlForm } from 'utilities';
import { editHours } from 'appConstants';
import { SwapHours } from 'components';
import { updateItemDetail } from 'pages/TimeOffCalendar/slice';
import { getItemDetailOfTimeOffRequests } from 'pages/TimeOffCalendar/selectors';
import styles from './Item.module.scss';

interface Props {
  item: TimeOffRequestItemDetail;
  lastRow: boolean;
  index: number;
}

export default function Item(props: Props) {
  const {
    item,
    lastRow,
    index,
  } = props;
  /* eslint-disable camelcase */
  const {
    payCode1_DisplayValue,
    payCode2_DisplayValue,
    requestDate,
    requestDate_DisplayValue,
    payCodeId1,
    payCodeId2,
    duration1,
    duration2,
  } = item;
  const [t] = useTranslation();
  const navigate = useNavigate();
  const ItemsDetail = useSelector(getItemDetailOfTimeOffRequests);
  const { setSize, setExpandedItems, expandedItems } = useContext(ListContext);
  const root = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (root && root.current) {
      setSize(index, root.current.getBoundingClientRect().height);
    }
  }, [index, expandedItems[index]]);

  const onExpandToggle = () => {
    setExpandedItems((prevExpandedItems) => {
      const newExpandedItems = [...prevExpandedItems];
      newExpandedItems[index] = !newExpandedItems[index] || false;
      return newExpandedItems;
    });
  };

  const onRowClick = () => {
    dispatch(updateItemDetail(ItemsDetail));
    navigate(editHours, {
      state: {
        requestDate,
      },
    });
  };

  const className = lastRow ? `${styles.container} ${styles.lastRow}` : styles.container;

  return (
    <div
      className={`${className} ${styles.timeOfRequestDetail}`}
      ref={root}
    >
      <Grid
        container
        className={styles.mainContainer}
      >
        <Grid
          item
          onClick={onRowClick}
          xs={5}
          md={5}
          lg={5}
          className={styles.label}
        >
          {getDateAgainstFormat(convertStringIntoDayJsDate(requestDate), formatsMapper['MM/DD/YYYY'])}
        </Grid>
        <Grid
          item
          onClick={onRowClick}
          xs={6}
          md={6}
          lg={6}
          className={styles.durationlabel}
        >
          {`${durationConvertionInDeciamlForm(duration1, duration2)} ${t('hrs')}`}

        </Grid>
        <Grid
          xs={1}
          md={1}
          lg={1}
          className={styles.lastGridItem}
          item
        >
          <IconButton onClick={onExpandToggle}>
            {expandedItems[index]
              ? <ExpandLessIcon className={styles.expandMoreExpandLessIconColor} />
              : <ExpandMoreIcon className={styles.expandMoreExpandLessIconColor} />}
          </IconButton>
        </Grid>
      </Grid>

      {expandedItems[index] && (
        <Fade in={expandedItems[index]} timeout={800}>
          <Grid
            container
            className={`${styles.detailContainer} ${styles.expandedItemSeprator}`}
          >
            <Grid
              container
              onClick={onRowClick}
              className={styles.marginAtTopGrid}
            >
              <Grid
                item
                xs={5}
                md={5}
                lg={5}
                className={styles.dayKey}
              >
                <Typography
                  className={styles.typographyHeading}
                >
                  {t('day')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={7}
                md={7}
                lg={7}
                className={styles.dayValue}
              >
                <Typography
                  className={styles.typographyValue}
                >
                  {convertStringIntoDayJsDate(requestDate_DisplayValue).format('dddd')}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              className={styles.marginBetweenGrids}
              container
            >
              <Grid
                item
                xs={10.5}
                md={10.5}
                lg={10.5}
              >
                {
                  payCodeId1 !== 0 && (
                    <>
                      {' '}
                      <Grid container>
                        <Grid
                          item
                          xs={5.75}
                          md={5.75}
                          lg={5.75}
                          className={styles.payCode1Key}
                        >
                          <Typography
                            sx={{
                              paddingLeft: '17px',
                            }}
                            className={styles.typographyHeading}
                          >
                            {t('hoursType')}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          onClick={onRowClick}
                          xs={6.25}
                          md={6.25}
                          lg={6.25}
                          className={styles.payCode1Value}
                        >
                          <Typography
                            className={styles.typographyValue}
                          >
                            {payCode1_DisplayValue}
                            {` - ${durationConvertionInDeciamlForm(duration1, 0)} ${t('hrs')}`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )
                }
                {
                  payCodeId2 !== 0 && (
                    <Grid
                      mt={0.2}
                      container
                    >
                      <Grid
                        item
                        xs={5.75}
                        md={5.75}
                        lg={5.75}
                        className={styles.payCode2Key}
                      >
                        <Typography
                          sx={{
                            paddingLeft: '17px',
                          }}
                          className={styles.typographyHeading}
                        >
                          {t('hoursType')}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        onClick={onRowClick}
                        xs={6.25}
                        md={6.25}
                        lg={6.25}
                        className={styles.payCode1Value}
                      >
                        <Typography
                          pt={0.1}
                          className={styles.typographyValue}
                        >
                          {payCode2_DisplayValue}
                          {` - ${durationConvertionInDeciamlForm(duration2, 0)} ${t('hrs')}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  )
                }

              </Grid>
              <Grid
                item
                xs={1.5}
                md={1.5}
                display="flex"
                justifyContent="flex-end"
                lg={1.5}
              >
                <SwapHours
                  itemIndex={index}
                  primaryPayCode={payCodeId1}
                  primaryDuration={duration1}
                  secondaryDuration={duration2}
                  secondaryPayCode={payCodeId2}
                />
              </Grid>
            </Grid>
          </Grid>
        </Fade>
      )}

    </div>
  );
}
