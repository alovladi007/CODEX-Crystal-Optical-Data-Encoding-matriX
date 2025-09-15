import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';

const decodeSchema = z.object({
  archiveId: z.string(),
  options: z.object({
    verifyIntegrity: z.boolean().default(true),
    repairErrors: z.boolean().default(true),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { archiveId, options = { verifyIntegrity: true, repairErrors: false } } = decodeSchema.parse(await request.json());

    // Load archive
    const archivePath = join(process.cwd(), 'archives', `${archiveId}.crystal`);
    const archiveData = JSON.parse(await readFile(archivePath, 'utf-8'));
    
    const { manifest, data } = archiveData;

    // Verify integrity if requested
    if (options.verifyIntegrity) {
      const integrityCheck = await verifyArchiveIntegrity(manifest, data);
      if (!integrityCheck.valid) {
        return NextResponse.json({
          success: false,
          error: 'Archive integrity check failed',
          details: integrityCheck.errors,
        }, { status: 400 });
      }
    }

    // Decode files
    const decodedFiles = await Promise.all(
      data.map(async (encodedData: string, index: number) => {
        const fileInfo = manifest.files[index];
        
        // Decode 5D optical data
        const decodedContent = await decode5DOptical(encodedData, manifest.profile);
        
        // Verify checksum
        const checksum = createHash('sha256').update(decodedContent).digest('hex');
        const checksumValid = checksum === fileInfo.checksum;
        
        return {
          name: fileInfo.name,
          type: fileInfo.type,
          content: decodedContent,
          size: decodedContent.length,
          checksumValid,
          originalSize: fileInfo.originalSize,
          compressionRatio: Math.round((1 - fileInfo.compressedSize / fileInfo.originalSize) * 100),
        };
      })
    );

    // Check if any files failed integrity check
    const failedFiles = decodedFiles.filter(f => !f.checksumValid);
    if (failedFiles.length > 0 && !options.repairErrors) {
      return NextResponse.json({
        success: false,
        error: 'Some files failed integrity check',
        failedFiles: failedFiles.map(f => f.name),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      files: decodedFiles,
      manifest: {
        version: manifest.version,
        profile: manifest.profile,
        created: manifest.created,
        totalFiles: manifest.totalFiles,
        compressionRatio: manifest.compressionRatio,
      },
      message: 'Archive decoded successfully',
    });

  } catch (error) {
    console.error('Decode error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to decode archive' },
      { status: 500 }
    );
  }
}

// Decode 5D optical data
async function decode5DOptical(encodedData: string, profile: string): Promise<string> {
  try {
    const parsed = JSON.parse(encodedData);
    
    if (parsed.encoding !== '5D_OPTICAL') {
      throw new Error('Invalid encoding format');
    }
    
    // Reconstruct binary from voxels
    let binary = '';
    for (const voxel of parsed.voxels) {
      // Convert orientation and retardance back to bits
      const orientationBits = voxel.orientation.toString(2).padStart(3, '0');
      const retardanceBits = voxel.retardance.toString(2).padStart(2, '0');
      binary += orientationBits + retardanceBits;
    }
    
    // Convert binary back to string
    const bytes = [];
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.slice(i, i + 8).padEnd(8, '0');
      bytes.push(parseInt(byte, 2));
    }
    
    return String.fromCharCode(...bytes);
    
  } catch (error) {
    console.error('5D decode error:', error);
    throw new Error('Failed to decode 5D optical data');
  }
}

// Verify archive integrity
async function verifyArchiveIntegrity(manifest: any, data: string[]): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  
  // Check if number of files matches
  if (data.length !== manifest.files.length) {
    errors.push(`File count mismatch: expected ${manifest.files.length}, got ${data.length}`);
  }
  
  // Check manifest structure
  const requiredFields = ['version', 'profile', 'created', 'archiveId', 'files'];
  for (const field of requiredFields) {
    if (!manifest[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Check file integrity
  for (let i = 0; i < data.length; i++) {
    const fileData = data[i];
    const fileInfo = manifest.files[i];
    
    if (!fileData || !fileInfo) {
      errors.push(`Missing data for file ${i}`);
      continue;
    }
    
    // Verify data can be parsed
    try {
      JSON.parse(fileData);
    } catch {
      errors.push(`Invalid data format for file: ${fileInfo.name}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
