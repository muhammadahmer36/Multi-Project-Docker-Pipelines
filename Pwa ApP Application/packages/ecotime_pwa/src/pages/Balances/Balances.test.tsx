import Balances from './Balances';
import renderWithReduxAndRouter from 'utilities/cutomRender.test';

describe('addAdaReg', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<Balances />);
    });
});
