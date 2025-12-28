import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HotkeysModal } from '@/components/game/HotkeysModal';

describe('HotkeysModal', () => {
    it('does not render when closed', () => {
        render(<HotkeysModal isOpen={false} onClose={() => { }} />);
        expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
    });

    it('renders all hotkeys when open', () => {
        render(<HotkeysModal isOpen={true} onClose={() => { }} />);

        expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
        expect(screen.getByText('Place Bet')).toBeInTheDocument();
        expect(screen.getByText('Double Bet')).toBeInTheDocument();
        expect(screen.getByText('Halve Bet')).toBeInTheDocument();
        expect(screen.getByText('Show Hotkeys')).toBeInTheDocument();
    });

    it('displays the correct key bindings', () => {
        render(<HotkeysModal isOpen={true} onClose={() => { }} />);

        expect(screen.getByText('Space')).toBeInTheDocument();
        expect(screen.getByText('D')).toBeInTheDocument();
        expect(screen.getByText('H')).toBeInTheDocument();
        expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const handleClose = jest.fn();
        render(<HotkeysModal isOpen={true} onClose={handleClose} />);

        await user.click(screen.getByRole('button'));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
