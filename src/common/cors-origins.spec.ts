import { corsOrigins } from './cors-origins.js';

describe('corsOrigins', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it('splits a comma-separated list', () => {
    vi.stubEnv('CORS_ORIGINS', 'http://a.test,http://b.test');
    const result = corsOrigins();
    expect(result).toEqual(['http://a.test', 'http://b.test']);
  });

  it('returns an empty list when CORS_ORIGINS is not set', () => {
    vi.stubEnv('CORS_ORIGINS', undefined);
    const result = corsOrigins();
    expect(result).toEqual([]);
  });
});
