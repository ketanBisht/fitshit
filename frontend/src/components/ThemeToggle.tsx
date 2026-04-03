'use client';
import { useTheme } from '@/lib/theme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      aria-label="Toggle theme"
    >
      <span className="theme-toggle-knob" />
    </button>
  );
}
