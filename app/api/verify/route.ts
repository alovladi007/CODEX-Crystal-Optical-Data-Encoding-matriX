import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';

const verifySchema = z.object({
  archiveId: z.string(),
  options: z.object({
    deepScan: z.boolean().default(false),
    repairMode: z.boolean().default(false),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { archiveId, options = { deepScan: false, repairMode: false } } = verifySchema.parse(await request.json());

    // Load archive
    const archivePath = join(process.cwd(), 'archives', `${archiveId}.crystal`);
    
    // Check if file exists
    try {
      await stat(archivePath);
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Archive not found',
      }, { status: 404 });
    }

    const archiveData = JSON.parse(await readFile(archivePath, 'utf-8'));
    const { manifest, data } = archiveData;

    // Basic verification
    const basicVerification = await performBasicVerification(manifest, data);
    
    // Deep scan if requested
    let deepVerification = null;
    if (options.deepScan) {
      deepVerification = await performDeepVerification(manifest, data);
    }

    // Calculate health score
    const healthScore = calculateHealthScore(basicVerification, deepVerification);
    
    // Generate report
    const report = {
      archiveId,
      timestamp: new Date().toISOString(),
      basicVerification,
      deepVerification,
      healthScore,
      recommendations: generateRecommendations(basicVerification, deepVerification, healthScore),
    };

    return NextResponse.json({
      success: true,
      report,
      message: 'Verification completed successfully',
    });

  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify archive' },
      { status: 500 }
    );
  }
}

// Perform basic verification
async function performBasicVerification(manifest: any, data: string[]): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  fileCount: number;
  totalSize: number;
  compressionRatio: number;
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check manifest structure
  if (!manifest.version || !manifest.profile || !manifest.files) {
    errors.push('Invalid manifest structure');
  }
  
  // Check file count
  const fileCount = data.length;
  if (fileCount !== manifest.files.length) {
    errors.push(`File count mismatch: manifest says ${manifest.files.length}, actual ${fileCount}`);
  }
  
  // Check file sizes
  let totalSize = 0;
  for (let i = 0; i < data.length; i++) {
    const fileData = data[i];
    const fileInfo = manifest.files[i];
    
    if (!fileData) {
      errors.push(`Missing data for file: ${fileInfo?.name || i}`);
      continue;
    }
    
    const actualSize = fileData.length;
    totalSize += actualSize;
    
    if (fileInfo && actualSize !== fileInfo.encodedSize) {
      warnings.push(`Size mismatch for ${fileInfo.name}: expected ${fileInfo.encodedSize}, got ${actualSize}`);
    }
  }
  
  // Calculate compression ratio
  const compressionRatio = manifest.totalOriginalSize > 0 
    ? Math.round((1 - manifest.totalCompressedSize / manifest.totalOriginalSize) * 100)
    : 0;
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fileCount,
    totalSize,
    compressionRatio,
  };
}

// Perform deep verification
async function performDeepVerification(manifest: any, data: string[]): Promise<{
  dataIntegrity: boolean;
  encodingValid: boolean;
  errorCorrectionValid: boolean;
  checksumsValid: boolean;
  details: any;
}> {
  let dataIntegrity = true;
  let encodingValid = true;
  let errorCorrectionValid = true;
  let checksumsValid = true;
  const details: any = {
    files: [],
    errors: [],
  };
  
  for (let i = 0; i < data.length; i++) {
    const fileData = data[i];
    const fileInfo = manifest.files[i];
    
    const fileDetails = {
      name: fileInfo.name,
      dataIntegrity: true,
      encodingValid: true,
      errorCorrectionValid: true,
      checksumValid: true,
      errors: [] as string[],
    };
    
    try {
      // Parse encoded data
      const parsed = JSON.parse(fileData);
      
      // Check encoding format
      if (parsed.encoding !== '5D_OPTICAL') {
        fileDetails.encodingValid = false;
        encodingValid = false;
        fileDetails.errors.push('Invalid encoding format');
      }
      
      // Check error correction data
      if (parsed.correction) {
        // Verify LDPC codes
        const expectedLDPC = generateLDPCCodes(parsed.original);
        if (parsed.correction.ldpc !== expectedLDPC) {
          fileDetails.errorCorrectionValid = false;
          errorCorrectionValid = false;
          fileDetails.errors.push('LDPC code mismatch');
        }
        
        // Verify Reed-Solomon codes
        const expectedRS = generateReedSolomonCodes(parsed.original);
        if (parsed.correction.reedSolomon !== expectedRS) {
          fileDetails.errorCorrectionValid = false;
          errorCorrectionValid = false;
          fileDetails.errors.push('Reed-Solomon code mismatch');
        }
      }
      
      // Verify checksum
      const checksum = createHash('sha256').update(parsed.original).digest('hex');
      if (checksum !== fileInfo.checksum) {
        fileDetails.checksumValid = false;
        checksumsValid = false;
        fileDetails.errors.push('Checksum mismatch');
      }
      
    } catch (error) {
      fileDetails.dataIntegrity = false;
      dataIntegrity = false;
      fileDetails.errors.push('Failed to parse encoded data');
    }
    
    details.files.push(fileDetails);
  }
  
  return {
    dataIntegrity,
    encodingValid,
    errorCorrectionValid,
    checksumsValid,
    details,
  };
}

// Calculate health score
function calculateHealthScore(basic: any, deep: any): number {
  let score = 100;
  
  // Deduct for basic errors
  score -= basic.errors.length * 10;
  score -= basic.warnings.length * 5;
  
  // Deduct for deep scan issues
  if (deep) {
    if (!deep.dataIntegrity) score -= 20;
    if (!deep.encodingValid) score -= 15;
    if (!deep.errorCorrectionValid) score -= 10;
    if (!deep.checksumsValid) score -= 15;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Generate recommendations
function generateRecommendations(basic: any, deep: any, healthScore: number): string[] {
  const recommendations: string[] = [];
  
  if (healthScore < 50) {
    recommendations.push('Archive health is critical. Consider creating a new backup immediately.');
  } else if (healthScore < 80) {
    recommendations.push('Archive health is degraded. Monitor closely and consider refreshing.');
  }
  
  if (basic.errors.length > 0) {
    recommendations.push('Fix basic structural errors before using the archive.');
  }
  
  if (basic.warnings.length > 0) {
    recommendations.push('Address warnings to improve archive reliability.');
  }
  
  if (deep && !deep.checksumsValid) {
    recommendations.push('Data integrity issues detected. Verify source files and re-encode if necessary.');
  }
  
  if (deep && !deep.errorCorrectionValid) {
    recommendations.push('Error correction data is corrupted. Archive may not be recoverable from damage.');
  }
  
  return recommendations;
}

// Helper functions (simplified versions)
function generateLDPCCodes(data: string): string {
  const checksum = createHash('sha256').update(data).digest('hex');
  return checksum.substring(0, 32);
}

function generateReedSolomonCodes(data: string): string {
  const checksum = createHash('md5').update(data).digest('hex');
  return checksum.substring(0, 16);
}
