import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Path to the Project Pulse PDF folder
    const pdfFolderPath = join(process.cwd(), 'public', 'Project Pulse', 'Project Pulse PDF');
    
    // Dynamically find all PNG image files in the directory
    const files = await readdir(pdfFolderPath);
    const imageFiles = files
      .filter(file => file.toLowerCase().endsWith('.png'))
      .sort((a, b) => {
        // Sort naturally: 1.png, 2.png, ..., 10.png, etc.
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
    
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'No PNG images found in the directory' },
        { status: 404 }
      );
    }
    
    // Process each image and add it as a page to the PDF
    for (const imageFile of imageFiles) {
      const imagePath = join(pdfFolderPath, imageFile);
      
      try {
        // Read the image file
        const imageBuffer = await readFile(imagePath);
        
        // Convert PNG to JPEG using sharp (for better PDF compatibility)
        const jpegBuffer = await sharp(imageBuffer)
          .jpeg({ quality: 95 })
          .toBuffer();
        
        // Get image dimensions
        const imageMetadata = await sharp(jpegBuffer).metadata();
        const width = imageMetadata.width || 2480; // Default A4 width in pixels at 300 DPI
        const height = imageMetadata.height || 3508; // Default A4 height in pixels at 300 DPI
        
        // Embed the image in the PDF
        const image = await pdfDoc.embedJpg(jpegBuffer);
        
        // Add a new page with the same dimensions as the image
        const page = pdfDoc.addPage([width, height]);
        
        // Draw the image on the page, filling the entire page
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
      } catch (imageError) {
        console.error(`Error processing image ${imageFile}:`, imageError);
        // Continue with other images even if one fails
        continue;
      }
    }
    
    // Generate the PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    // Convert Uint8Array to Buffer for NextResponse
    const pdfBuffer = Buffer.from(pdfBytes);
    
    // Return the PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="ProjectPulse-Brochure.pdf"',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
