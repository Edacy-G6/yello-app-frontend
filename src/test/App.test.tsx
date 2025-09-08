import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the home page', () => {
    render(<App />);
    expect(screen.getByText(/Bienvenue sur Yello/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getAllByText('Accueil')).toHaveLength(2); // Header et footer
    expect(screen.getAllByText('À propos')).toHaveLength(2); // Header et footer
    expect(screen.getAllByText('Contact')).toHaveLength(2); // Header et footer
  });
});
