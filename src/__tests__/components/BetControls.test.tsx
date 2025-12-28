import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BetControls } from '@/components/game/BetControls';

describe('BetControls', () => {
    const defaultProps = {
        bet: 10,
        multiplier: 2,
        target: 4950,
        onBetChange: jest.fn(),
        onMultiplierChange: jest.fn(),
        onDouble: jest.fn(),
        onHalve: jest.fn(),
        onPlay: jest.fn(),
        loading: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('displays the bet amount', () => {
        render(<BetControls {...defaultProps} />);
        expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    it('displays the multiplier', () => {
        render(<BetControls {...defaultProps} />);
        expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    });

    it('displays win chance correctly', () => {
        render(<BetControls {...defaultProps} />);
        // target / 100 = 49.50%
        expect(screen.getByText('49.50%')).toBeInTheDocument();
    });

    it('displays house edge correctly', () => {
        render(<BetControls {...defaultProps} />);
        // 100 - (49.5 * 2) = 1%
        expect(screen.getByText('1.00%')).toBeInTheDocument();
    });

    it('displays roll under target', () => {
        render(<BetControls {...defaultProps} />);
        expect(screen.getByText('4950')).toBeInTheDocument();
    });

    it('calls onDouble when 2x button is clicked', async () => {
        const user = userEvent.setup();
        render(<BetControls {...defaultProps} />);

        await user.click(screen.getByText('2x'));
        expect(defaultProps.onDouble).toHaveBeenCalledTimes(1);
    });

    it('calls onHalve when ½ button is clicked', async () => {
        const user = userEvent.setup();
        render(<BetControls {...defaultProps} />);

        await user.click(screen.getByText('½'));
        expect(defaultProps.onHalve).toHaveBeenCalledTimes(1);
    });

    it('calls onPlay when Place Bet button is clicked', async () => {
        const user = userEvent.setup();
        render(<BetControls {...defaultProps} />);

        await user.click(screen.getByRole('button', { name: /place bet/i }));
        expect(defaultProps.onPlay).toHaveBeenCalledTimes(1);
    });

    it('disables Place Bet button when loading', () => {
        render(<BetControls {...defaultProps} loading={true} />);
        const buttons = screen.getAllByRole('button');
        const placeBetButton = buttons.find(b => b.textContent !== '½' && b.textContent !== '2x');
        expect(placeBetButton).toBeDisabled();
    });
});
