import styles from './TabPanel.module.scss';

export default function TabPanel(props: { children: React.ReactNode; value: number; index: number;}) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={styles.container}
      {...other}
    >
      {value === index
        && (
        <div>
          {children}
        </div>
        )}
    </div>
  );
}
