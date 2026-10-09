// components/dashboard/layout/__tests__/JoinEditionNotice.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const toast = vi.hoisted(() => ({ success: vi.fn(), warning: vi.fn(), error: vi.fn() }));
vi.mock('sonner', () => ({ toast }));

import JoinEditionNotice, { parseJoinResult } from '@/components/dashboard/layout/JoinEditionNotice';

const program = { id: 'p5', name: 'Japan Youth Summit 5th' };

function mockJoin(status: number, body: unknown) {
  const fetchMock = vi.fn(async () => ({ ok: status < 400, status, json: async () => body }));
  vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
  return fetchMock;
}

describe('JoinEditionNotice', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    Object.values(toast).forEach((fn) => fn.mockReset());
  });

  it('names the open edition and offers a single button', () => {
    render(<JoinEditionNotice program={program} onJoined={async () => {}} />);
    expect(screen.getByText('Registration for Japan Youth Summit 5th is open.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply for Japan Youth Summit 5th' })).toBeEnabled();
  });

  it('joins, refreshes via onJoined, and toasts success; button is busy meanwhile', async () => {
    const fetchMock = mockJoin(200, { data: { status: 'created', programId: 'p5', programName: program.name } });
    let release: () => void = () => {};
    const onJoined = vi.fn(() => new Promise<void>((resolve) => { release = resolve; }));
    render(<JoinEditionNotice program={program} onJoined={onJoined} />);

    await userEvent.click(screen.getByRole('button'));
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { body: string }];
    expect(url).toBe('/api/portal/join-program');
    expect(JSON.parse(init.body)).toEqual({ programId: 'p5' });

    release();
    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
    expect(onJoined).toHaveBeenCalledWith('p5');
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('also surfaces a category fallback', async () => {
    mockJoin(200, { data: { status: 'existing', programId: 'p5', programName: program.name, categoryFallback: { requested: 'fully_funded', assigned: 'self_funded' } } });
    render(<JoinEditionNotice program={program} onJoined={async () => {}} />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(toast.warning).toHaveBeenCalledTimes(1));
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it('warns on closed and does not select the edition', async () => {
    mockJoin(200, { data: { status: 'closed', programId: 'p5', programName: program.name } });
    const onJoined = vi.fn(async () => {});
    render(<JoinEditionNotice program={program} onJoined={onJoined} />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(toast.warning).toHaveBeenCalledWith(expect.stringContaining('has closed')));
    expect(onJoined).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('toasts an error on HTTP failure and re-enables the button', async () => {
    mockJoin(500, { message: 'boom' });
    render(<JoinEditionNotice program={program} onJoined={async () => {}} />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('boom'));
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('toasts an error on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }) as unknown as typeof fetch);
    render(<JoinEditionNotice program={program} onJoined={async () => {}} />);
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('button')).toBeEnabled();
  });
});

describe('parseJoinResult', () => {
  it('reads both wrapped and unwrapped payloads', () => {
    const raw = { status: 'created', programId: 'p5', programName: 'X' };
    expect(parseJoinResult({ data: raw })?.status).toBe('created');
    expect(parseJoinResult(raw)?.programId).toBe('p5');
  });
  it('rejects unknown statuses and missing ids', () => {
    expect(parseJoinResult({ data: { status: 'weird', programId: 'p5' } })).toBeNull();
    expect(parseJoinResult({ data: { status: 'created' } })).toBeNull();
    expect(parseJoinResult(null)).toBeNull();
  });
});
