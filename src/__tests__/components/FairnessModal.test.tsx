import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FairnessModal } from '@/components/game/FairnessModal';
import { BetHistoryItem } from '@/types/game';

describe('FairnessModal', () => {
    const mockRoll: BetHistoryItem = {
        result: 1234,
        target: 5000,
        payout: 20,
        profit: 10,
        isWin: true,
        serverSeed: 'abc123',
        nonce: '42',
        serverHash: 'a'.repeat(64),
        seedUsed: 'clientseed_serverseed_42',
        betAmount: 10,
    };

    it('does not render when roll is null', () => {
        render(<FairnessModal isOpen={true} onClose={() => { }} roll={null} />);
        expect(screen.queryByText('Provably Fair Verification')).not.toBeInTheDocument();
    });

    it('renders verification details when open with a roll', () => {
        render(<FairnessModal isOpen={true} onClose={() => { }} roll={mockRoll} />);

        expect(screen.getByText('Provably Fair Verification')).toBeInTheDocument();
        expect(screen.getByText('Client Seed')).toBeInTheDocument();
        expect(screen.getByText('Server Seed')).toBeInTheDocument();
        expect(screen.getByText('Nonce')).toBeInTheDocument();
    });

    it('displays the full seed string', () => {
        render(<FairnessModal isOpen={true} onClose={() => { }} roll={mockRoll} />);
        expect(screen.getByText('clientseed_serverseed_42')).toBeInTheDocument();
    });

    it('displays the server hash', () => {
        render(<FairnessModal isOpen={true} onClose={() => { }} roll={mockRoll} />);
        expect(screen.getByText('a'.repeat(64))).toBeInTheDocument();
    });

    it('displays the result calculation', () => {
        render(<FairnessModal isOpen={true} onClose={() => { }} roll={mockRoll} />);
        expect(screen.getByText('1234')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const handleClose = jest.fn();
        render(<FairnessModal isOpen={true} onClose={handleClose} roll={mockRoll} />);

        await user.click(screen.getByRole('button'));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
