import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates debounced value only after the specified delay using fake timers', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce<string>(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'typing...', delay: 300 });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('typing...');
  });
});
