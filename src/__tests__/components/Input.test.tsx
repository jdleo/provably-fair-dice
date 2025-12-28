import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input', () => {
    it('renders an input element', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('handles value changes', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();
        render(<Input onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'hello');

        expect(handleChange).toHaveBeenCalled();
    });

    it('renders with an icon', () => {
        render(<Input icon={<span data-testid="icon">$</span>} />);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<Input className="custom-class" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('custom-class');
    });

    it('can be disabled', () => {
        render(<Input disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
