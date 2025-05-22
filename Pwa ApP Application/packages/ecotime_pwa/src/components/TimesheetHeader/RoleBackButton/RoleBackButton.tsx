import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import StyledIconButton from 'components/IconButton';

interface Props {
  onClickIconButton: () => void;
  }

const renderBackIconButton = ({
  onClickIconButton,
}: Props) => (
  <StyledIconButton
    IconSize="small"
    className="colorPrimary"
    edge="start"
    testId="et-icon"
    onClick={onClickIconButton}
    icon={<ArrowBackIosRoundedIcon />}
  />
);
export default renderBackIconButton;
