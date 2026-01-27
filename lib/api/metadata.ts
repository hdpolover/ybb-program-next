import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import type { CityMetadata, CountryMetadata, ShirtSizeMetadata, StateMetadata } from '@/types/metadata';

export async function getGenders(): Promise<string[]> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/metadata/genders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as { statusCode: number; message: string; data: string[] };
    if (json.statusCode !== 200 || !json.data) {
      throw new Error(json.message || 'Unexpected API response');
    }

    return json.data;
  }

  return apiGetWithEnvelope<string[]>('/v1/metadata/genders');
}

export async function getCountries(): Promise<CountryMetadata[]> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/metadata/countries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as {
      statusCode: number;
      message: string;
      data: CountryMetadata[];
    };
    if (json.statusCode !== 200 || !json.data) {
      throw new Error(json.message || 'Unexpected API response');
    }

    return json.data;
  }

  return apiGetWithEnvelope<CountryMetadata[]>('/v1/metadata/countries');
}

export async function getStates(countryCode: string): Promise<StateMetadata[]> {
  if (typeof window !== 'undefined') {
    const res = await fetch(`/api/metadata/states/${encodeURIComponent(countryCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as {
      statusCode: number;
      message: string;
      data: StateMetadata[];
    };
    if (json.statusCode !== 200 || !json.data) {
      throw new Error(json.message || 'Unexpected API response');
    }

    return json.data;
  }

  return apiGetWithEnvelope<StateMetadata[]>(`/v1/metadata/states/${encodeURIComponent(countryCode)}`);
}

export async function getCities(countryCode: string, stateCode?: string): Promise<CityMetadata[]> {
  const query = stateCode ? `?stateCode=${encodeURIComponent(stateCode)}` : '';

  if (typeof window !== 'undefined') {
    const res = await fetch(`/api/metadata/cities/${encodeURIComponent(countryCode)}${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as {
      statusCode: number;
      message: string;
      data: CityMetadata[];
    };
    if (json.statusCode !== 200 || !json.data) {
      throw new Error(json.message || 'Unexpected API response');
    }

    return json.data;
  }

  return apiGetWithEnvelope<CityMetadata[]>(
    `/v1/metadata/cities/${encodeURIComponent(countryCode)}${query}`,
  );
}

export async function getShirtSizes(): Promise<ShirtSizeMetadata[]> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/metadata/shirt-sizes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as {
      statusCode: number;
      message: string;
      data: ShirtSizeMetadata[];
    };
    if (json.statusCode !== 200 || !json.data) {
      throw new Error(json.message || 'Unexpected API response');
    }

    return json.data;
  }

  return apiGetWithEnvelope<ShirtSizeMetadata[]>('/v1/metadata/shirt-sizes');
}
