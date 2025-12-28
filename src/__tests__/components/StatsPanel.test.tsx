import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatsPanel } from '@/components/game/StatsPanel';

describe('StatsPanel', () => {
    const defaultProps = {
        balance: 1000,
        clientSeed: 'test-seed-123',
        onSeedChange: jest.fn(),
        onRandomizeSeed: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('displays the balance', () => {
        render(<StatsPanel {...defaultProps} />);
        expect(screen.getByText('$1000.00')).toBeInTheDocument();
    });

    it('displays the client seed', () => {
        render(<StatsPanel {...defaultProps} />);
        expect(screen.getByDisplayValue('test-seed-123')).toBeInTheDocument();
    });

    it('calls onSeedChange when seed input changes', async () => {
        const user = userEvent.setup();
        render(<StatsPanel {...defaultProps} />);

        const input = screen.getByDisplayValue('test-seed-123');
        await user.clear(input);
        await user.type(input, 'new-seed');

        expect(defaultProps.onSeedChange).toHaveBeenCalled();
    });

    it('calls onRandomizeSeed when random button is clicked', async () => {
        const user = userEvent.setup();
        render(<StatsPanel {...defaultProps} />);

        await user.click(screen.getByText('Random'));
        expect(defaultProps.onRandomizeSeed).toHaveBeenCalledTimes(1);
    });

    it('formats balance with two decimal places', () => {
        render(<StatsPanel {...defaultProps} balance={999.999} />);
        expect(screen.getByText('$1000.00')).toBeInTheDocument();
    });
});
