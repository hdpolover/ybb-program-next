const inFlightByKey = new Map<string, Promise<unknown>>();

export async function dedupeInFlight<T>(key: string, factory: () => Promise<T>): Promise<T> {
  const existing = inFlightByKey.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const next = factory().finally(() => {
    inFlightByKey.delete(key);
  });

  inFlightByKey.set(key, next as Promise<unknown>);
  return next;
}
