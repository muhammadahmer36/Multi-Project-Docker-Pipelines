import Dashboard from './dashboard';
import renderWithReduxAndRouter from '../../../src/utilities/cutomRender.test';

describe('addAdaReg', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<Dashboard />);
    });
});
