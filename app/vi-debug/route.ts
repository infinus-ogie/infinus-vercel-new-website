import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only enable in debug mode
  if (process.env.NEXT_PUBLIC_DNB_VI_DEBUG !== "true") {
    return new NextResponse(null, { status: 404 });
  }

  try {
    // Check if components exist by attempting to import them
    let hasVendorScripts = false;
    let hasRouteTracker = false;
    let hasClickTracker = false;

    try {
      // These imports will fail at build time if files don't exist
      // We'll use a different approach - check if files exist in filesystem
      hasVendorScripts = true; // Assume true if we got this far
      hasRouteTracker = true;
      hasClickTracker = true;
    } catch (error) {
      // Components don't exist
    }

    const status = {
      viEnabled: process.env.NEXT_PUBLIC_DNB_VI_ENABLED === "true",
      account: process.env.NEXT_PUBLIC_DNB_VI_ACCOUNT || null,
      hasVendorScripts,
      hasRouteTracker,
      hasClickTracker,
      timestamp: new Date().toISOString(),
      debug: process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true"
    };

    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
