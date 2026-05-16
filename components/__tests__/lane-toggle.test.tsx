// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { LaneToggle } from '../lane-toggle';

afterEach(cleanup);

// Mock next/navigation: usePathname returns whatever we set.
const usePathnameMock = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

// Mock next/link: render as a plain <a> so the link role is queryable.
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('LaneToggle', () => {
  test('on /dental, the Dental link is aria-current="page"', () => {
    usePathnameMock.mockReturnValue('/dental');
    render(<LaneToggle />);
    expect(screen.getByRole('link', { name: /dental/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: /medical/i })).not.toHaveAttribute(
      'aria-current',
    );
  });

  test('on /medical/tmj, the Medical link is aria-current="page"', () => {
    usePathnameMock.mockReturnValue('/medical/tmj');
    render(<LaneToggle />);
    expect(screen.getByRole('link', { name: /medical/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: /dental/i })).not.toHaveAttribute(
      'aria-current',
    );
  });

  test('on /, neither link is aria-current', () => {
    usePathnameMock.mockReturnValue('/');
    render(<LaneToggle />);
    expect(screen.getByRole('link', { name: /dental/i })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('link', { name: /medical/i })).not.toHaveAttribute(
      'aria-current',
    );
  });

  test('the group has accessible label "Practice lane"', () => {
    usePathnameMock.mockReturnValue('/');
    render(<LaneToggle />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      'Practice lane',
    );
  });
});
