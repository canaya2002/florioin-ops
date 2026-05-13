'use client';

import { useState } from 'react';
import { sendMagicLink } from './actions';

export function LoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const result = await sendMagicLink(formData);
    setPending(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-[color:var(--color-ink-soft)]">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="carlos@florioin.app"
          defaultValue="carlos@florioin.app"
          className="h-11 w-full rounded-xl border border-[color:var(--color-hairline-strong)] bg-white px-3 text-sm outline-none placeholder:text-[color:var(--color-ink-subtle)] focus:border-[color:var(--color-brand-violet)]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient h-11 w-full rounded-xl text-sm font-semibold text-white shadow-[0_18px_40px_-16px_rgba(168,140,255,0.55)] transition-all hover:shadow-[0_22px_48px_-14px_rgba(168,140,255,0.65)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Mandando...' : 'Mandarme magic link'}
      </button>

      {error && <p className="text-xs text-[#9a2230]">{error}</p>}
    </form>
  );
}
