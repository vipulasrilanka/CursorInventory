import { describe, it, expect } from 'vitest';
import { theme } from '../../theme';

describe('Theme Configuration', () => {
  it('has correct primary color', () => {
    expect(theme.palette.primary.main).toBe('#E31837'); // Zone24x7 red
  });

  it('has correct secondary color', () => {
    expect(theme.palette.secondary.main).toBe('#000000'); // Black
  });

  it('has correct background colors', () => {
    expect(theme.palette.background.default).toBe('#000000'); // Dark theme background
    expect(theme.palette.background.paper).toBe('#ffffff'); // White cards
  });

  it('has correct text colors', () => {
    expect(theme.palette.text.primary).toBe('#ffffff'); // White text for dark background
    expect(theme.palette.text.secondary).toBe('#cccccc'); // Light gray text for dark background
  });

  it('has correct AppBar background color', () => {
    const appBarStyle = theme.components?.MuiAppBar?.styleOverrides?.root as { backgroundColor: string };
    expect(appBarStyle?.backgroundColor).toBe('#000000');
  });

  it('has correct Button styles', () => {
    const buttonStyle = theme.components?.MuiButton?.styleOverrides?.root as { borderRadius: number };
    expect(buttonStyle?.borderRadius).toBe(0);
  });

  it('has correct Card styles', () => {
    const cardStyle = theme.components?.MuiCard?.styleOverrides?.root as { borderRadius: number };
    expect(cardStyle?.borderRadius).toBe(0);
  });
}); 