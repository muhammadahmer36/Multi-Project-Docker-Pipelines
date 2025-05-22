import Registration from './Registration';
import renderWithReduxAndRouter from 'utilities/cutomRender.test';

describe('Login', () => {
    it('renders Active Dir  registration correctly', () => {
        renderWithReduxAndRouter(<Registration />);
    });
});
