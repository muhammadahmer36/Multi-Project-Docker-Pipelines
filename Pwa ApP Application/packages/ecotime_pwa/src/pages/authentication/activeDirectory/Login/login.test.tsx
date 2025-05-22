import Login from './Login';
import renderWithReduxAndRouter from 'utilities/cutomRender.test';

describe('Login', () => {
    it('renders Active Dir correctly', () => {
        renderWithReduxAndRouter(<Login />);
    });
});
