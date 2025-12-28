import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/layout/Navbar';

describe('Navbar', () => {
    it('renders the brand name', () => {
        render(<Navbar />);
        expect(screen.getByText('Provably Fair Dice (Demo)')).toBeInTheDocument();
    });

    it('renders the version', () => {
        render(<Navbar />);
        expect(screen.getByText('v2.0')).toBeInTheDocument();
    });

    it('has sticky positioning', () => {
        render(<Navbar />);
        const header = screen.getByRole('banner');
        expect(header).toHaveClass('sticky');
    });
});
