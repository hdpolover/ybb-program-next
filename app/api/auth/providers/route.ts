import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api/httpClient';

type AuthProvider = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isOAuth: boolean;
  icon?: string;
  buttonColor?: string;
};

type ProvidersResponse = {
  statusCode: number;
  message: string;
  data: AuthProvider[];
};

export async function GET() {
  try {
    const json = await apiGet<ProvidersResponse>('/v1/auth/providers');
    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        statusCode: 500,
        message,
        data: [],
      },
      { status: 500 },
    );
  }
}
