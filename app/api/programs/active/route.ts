import { NextResponse } from 'next/server';
import { getProgramDetail } from '@/lib/api/programs';
import { resolveBrandDomain } from '@/lib/server/envContext';

export async function GET() {
  try {
    const host = await resolveBrandDomain();
    const programSlug = process.env.YBB_PROGRAM_SLUG?.trim();

    if (!programSlug) {
      return NextResponse.json(
        { statusCode: 404, message: 'No active program configured', data: null },
        { status: 404 }
      );
    }

    const program = await getProgramDetail(programSlug, host);

    if (!program) {
      return NextResponse.json(
        { statusCode: 404, message: 'Program not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: {
        registrationCloseDate: program.registrationCloseDate,
        programName: program.name,
      },
    });
  } catch (error) {
    console.error('Failed to fetch active program:', error);
    return NextResponse.json(
      { statusCode: 500, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}
