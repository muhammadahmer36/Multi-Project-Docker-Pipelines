import IconButton from '@mui/material/IconButton';
import managerSearch from 'assets/img/managerSearch.svg';
import { useNavigate } from 'react-router-dom';
import { timesheetSearchManager } from 'appConstants';
import styles from './Search.module.scss';

export default function Search() {
  const navigate = useNavigate();

  const onSearch = () => {
    navigate(timesheetSearchManager, { state: { fetchData: false } });
  };

  return (
    <IconButton onClick={onSearch}>
      <img
        src={managerSearch}
        alt="search"
        className={styles.image}
      />
    </IconButton>
  );
}
