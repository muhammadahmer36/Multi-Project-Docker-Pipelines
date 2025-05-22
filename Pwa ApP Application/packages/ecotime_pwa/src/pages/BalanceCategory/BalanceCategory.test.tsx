import BalanceCategory from './BalanceCategory';
import renderWithReduxAndRouter from 'utilities/cutomRender.test';

describe('addAdaReg', () => {
    it('renders correctly', () => {
        renderWithReduxAndRouter(<BalanceCategory />);
    });
});
