import Grid from '@mui/material/Grid';
import { BalanceGroupDetails } from 'pages/BalanceCategory/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { useContext, useEffect, useRef } from 'react';
import { ListContext } from 'pages/BalanceCategory/Detail/List/List';
import { useTranslation } from 'react-i18next';
import styles from './Item.module.scss';

interface Props {
  item: BalanceGroupDetails;
  lastRow: boolean;
  index: number;
}
export default function Item(props: Props) {
  const {
    item,
    lastRow,
    index,
  } = props;
  const {
    date,
    type,
    hours,
    totals,
    source,
  } = item;
  const [t] = useTranslation();

  const { setSize, setExpandedItems, expandedItems } = useContext(ListContext);
  const root = useRef<HTMLDivElement>(null);

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

  const className = lastRow ? `${styles.container} ${styles.lastRow}` : styles.container;
  const detailContainerClassName = lastRow ? styles.detailContainerWithNoBorder : styles.detailContainerWithBorder;
  return (
    <div
      className={className}
      ref={root}
    >
      <Grid
        container
        className={styles.mainContainer}
      >
        <Grid
          item
          xs={5.5}
          md={5.5}
          lg={5.5}
          className={styles.label}

        >
          {date}
        </Grid>
        <Grid
          item
          xs={6.5}
          md={6.5}
          lg={6.5}
          className={styles.item}
          display="flex"
          justifyContent="space-between"

        >
          {hours}
          <IconButton onClick={onExpandToggle}>
            {expandedItems[index]
              ? <ExpandLessIcon className={styles.expandMoreExpandLessIconColor} />
              : <ExpandMoreIcon className={styles.expandMoreExpandLessIconColor} />}
          </IconButton>
        </Grid>

      </Grid>
      {expandedItems[index] && (
        <Grid
          container
          className={detailContainerClassName}
        >
          <Grid
            item
            xs={5.5}
            md={5.5}
            lg={5.5}
            className={styles.label}
          >
            {t('detailType')}
          </Grid>
          <Grid
            item
            xs={6.5}
            md={6.5}
            lg={6.5}
            className={styles.value}
          >
            {type}
          </Grid>
          <Grid
            item
            xs={5.5}
            md={5.5}
            lg={5.5}
            className={styles.label}
          >
            {t('total')}
          </Grid>
          <Grid
            item
            xs={6.5}
            md={6.5}
            lg={6.5}
            className={styles.value}
          >
            {totals}
          </Grid>
          <Grid
            item
            xs={5.5}
            md={5.5}
            lg={5.5}
            className={styles.label}
          >
            {t('source')}
          </Grid>
          <Grid
            item
            xs={6.5}
            md={6.5}
            lg={6.5}
            pt={2}
            pb={2}
            className={styles.value}

          >
            {source}
          </Grid>
        </Grid>
      )}
    </div>
  );
}
