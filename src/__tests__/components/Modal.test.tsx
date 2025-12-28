import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/ui/modal';

describe('Modal', () => {
    it('does not render when closed', () => {
        render(<Modal isOpen={false} onClose={() => { }} title="Test">Content</Modal>);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when open', () => {
        render(<Modal isOpen={true} onClose={() => { }} title="Test Modal">Modal Content</Modal>);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const handleClose = jest.fn();
        render(<Modal isOpen={true} onClose={handleClose} title="Test">Content</Modal>);

        await user.click(screen.getByRole('button'));
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('applies wide class when wide prop is true', () => {
        render(<Modal isOpen={true} onClose={() => { }} title="Wide" wide>Content</Modal>);
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveClass('max-w-2xl');
    });

    it('applies default width when wide prop is false', () => {
        render(<Modal isOpen={true} onClose={() => { }} title="Normal">Content</Modal>);
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveClass('max-w-lg');
    });
});
