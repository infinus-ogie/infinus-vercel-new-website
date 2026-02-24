import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Path to the ProjectPulse Brochure PDF file
    const pdfPath = join(process.cwd(), 'public', 'Project Pulse', 'Project Pulse - Brosura 2026', 'Infinus brosura 3.pdf');
    
    // Read the PDF file
    const pdfBuffer = await readFile(pdfPath);
    
    // Get file stats for ETag (cache validation)
    const stats = await stat(pdfPath);
    const etag = `"${stats.mtime.getTime()}-${stats.size}"`;
    
    // Check if client has cached version
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }
    
    // Return the PDF with appropriate headers
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="ProjectPulse-Brochure.pdf"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': etag,
      },
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'Failed to serve PDF' },
      { status: 500 }
    );
  }
}
