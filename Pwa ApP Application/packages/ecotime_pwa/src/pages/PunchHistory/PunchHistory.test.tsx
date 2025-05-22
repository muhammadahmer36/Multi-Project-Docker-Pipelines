import PunchHistory from './PunchHistory';
import renderWithReduxAndRouter from 'utilities/cutomRender.test';

describe('Punch History', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<PunchHistory />);
    });
});
