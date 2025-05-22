import PasswordExpired from './passwordExpired';
import renderWithReduxAndRouter from '../../../../utilities/cutomRender.test';

describe('Login', () => {
    it('renders Active Dir  registration correctly', () => {
        renderWithReduxAndRouter(<PasswordExpired />);
    });
});
