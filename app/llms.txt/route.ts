import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the llms.txt file from public directory
    const filePath = join(process.cwd(), 'public', 'llms.txt');
    const fileContent = await readFile(filePath, 'utf-8');

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error reading llms.txt:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}

