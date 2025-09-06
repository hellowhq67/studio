
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
     return NextResponse.json({ message: 'No filename provided.' }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
        access: 'public',
        // Add a cache control header to serve the file from the edge cache
        // for 1 year. See https://vercel.com/docs/edge-network/caching
        addRandomSuffix: false,
    });

    return NextResponse.json(blob);

  } catch (error: any) {
    return NextResponse.json({ message: 'Error uploading file.', error: error.message }, { status: 500 });
  }
}
