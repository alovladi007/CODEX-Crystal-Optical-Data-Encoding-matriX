import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { archiveId: string } }
) {
  try {
    const { archiveId } = params;
    
    // Validate archive ID
    if (!archiveId || archiveId.length !== 16) {
      return NextResponse.json(
        { success: false, error: 'Invalid archive ID' },
        { status: 400 }
      );
    }
    
    // Check if archive exists
    const archivePath = join(process.cwd(), 'archives', `${archiveId}.crystal`);
    
    try {
      await stat(archivePath);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Archive not found' },
        { status: 404 }
      );
    }
    
    // Read archive file
    const archiveData = await readFile(archivePath, 'utf-8');
    const parsed = JSON.parse(archiveData);
    
    // Return archive data
    return NextResponse.json({
      success: true,
      archiveId,
      manifest: parsed.manifest,
      data: parsed.data,
      downloadUrl: `/api/download/${archiveId}`,
      message: 'Archive retrieved successfully',
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download archive' },
      { status: 500 }
    );
  }
}

// Download as file
export async function POST(
  request: NextRequest,
  { params }: { params: { archiveId: string } }
) {
  try {
    const { archiveId } = params;
    
    // Check if archive exists
    const archivePath = join(process.cwd(), 'archives', `${archiveId}.crystal`);
    
    try {
      await stat(archivePath);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Archive not found' },
        { status: 404 }
      );
    }
    
    // Read archive file
    const archiveData = await readFile(archivePath, 'utf-8');
    
    // Return as downloadable file
    return new NextResponse(archiveData, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${archiveId}.crystal"`,
        'Content-Length': archiveData.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Download file error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download archive file' },
      { status: 500 }
    );
  }
}
