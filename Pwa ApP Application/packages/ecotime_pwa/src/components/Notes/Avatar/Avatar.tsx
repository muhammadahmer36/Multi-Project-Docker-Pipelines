import { getInitialsOfFirstAndLastName } from 'utilities';
import Avatar from '@mui/material/Avatar';
import styles from './NotesAvatar.module.scss';

export interface NotesAvatarProps {
  notesEnteredBy: string;
  avatarBackGroundColor: string;
}

export default function NotesAvatar(props: NotesAvatarProps) {
  const { notesEnteredBy, avatarBackGroundColor } = props;

  return (
    <Avatar
      className={`${styles.avatar} ${avatarBackGroundColor}`}
    >
      {notesEnteredBy && getInitialsOfFirstAndLastName(notesEnteredBy)}
    </Avatar>
  );
}
