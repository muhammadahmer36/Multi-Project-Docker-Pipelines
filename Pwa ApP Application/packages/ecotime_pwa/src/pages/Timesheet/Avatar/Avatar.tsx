import { getInitialsOfFirstAndLastName } from 'utilities';
import Avatar from '@mui/material/Avatar';
import { getAppInformation } from 'pages/dashboard/selectors';
import about from 'assets/img/about.svg';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import { useManagerSelectedTimesheet } from 'common/hooks';
import styles from './TimesheetAvatar.module.scss';
import { setVisibleInformationPopup } from '../slice';

export default function IAvatar() {
  const { userEmployeeName } = useSelector(getAppInformation);
  const { employeeName } = useManagerSelectedTimesheet();
  const dispatch = useDispatch();
  const name = employeeName || userEmployeeName;

  const onClickInformation = () => {
    dispatch(setVisibleInformationPopup(true));
  };

  return (
    <>
      <Avatar
        className={styles.avatar}
      >
        {getInitialsOfFirstAndLastName(name)}
      </Avatar>
      <div
        className={styles.greetingMessage}
      >
        {name}
        <IconButton onClick={onClickInformation}>
          <img
            src={about}
            alt="certified"
            className={styles.image}
          />
        </IconButton>
      </div>

    </>
  );
}
