import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the llms.txt file from public directory
    // Priority: public/.well-known/llms.txt > public/llms.txt
    let filePath: string;
    let fileContent: string;
    
    // Try public/.well-known/llms.txt first
    try {
      filePath = join(process.cwd(), 'public', '.well-known', 'llms.txt');
      fileContent = await readFile(filePath, 'utf-8');
    } catch {
      // Fallback to public/llms.txt
      try {
        filePath = join(process.cwd(), 'public', 'llms.txt');
        fileContent = await readFile(filePath, 'utf-8');
      } catch (fallbackError) {
        console.error('Error reading llms.txt from both locations:', fallbackError);
        return new NextResponse('LLMs.txt file not found', { 
          status: 404,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });
      }
    }

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error reading llms.txt:', error);
    return new NextResponse('Internal server error', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}

