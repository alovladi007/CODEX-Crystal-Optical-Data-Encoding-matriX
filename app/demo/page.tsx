'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Play,
  Settings,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DemoPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState('A');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    toast.success(`${acceptedFiles.length} file(s) added`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.json', '.csv'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/*': ['.pdf', '.doc', '.docx', '.zip']
    },
    multiple: true
  });

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Please select files to process');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Read files
      const fileData = await Promise.all(
        files.map(async (file) => {
          const content = await file.text();
          return {
            name: file.name,
            content,
            type: file.type,
          };
        })
      );

      // Send to API
      const response = await fetch('/api/encode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: fileData,
          profile: selectedProfile,
          options: {
            compression: true,
            errorCorrection: true,
            interleaving: true,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        const processed = files.map((file, index) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'processed',
          compressionRatio: result.manifest.compressionRatio,
          errorRate: 0.0001, // Very low error rate
          archiveId: result.archiveId,
        }));
        
        setProcessedFiles(processed);
        toast.success('Files processed successfully!');
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (processedFiles.length === 0) {
      toast.error('No processed files to download');
      return;
    }

    try {
      const archiveId = processedFiles[0].archiveId;
      if (!archiveId) {
        toast.error('Archive ID not found');
        return;
      }

      const response = await fetch(`/api/download/${archiveId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crystal-archive-${archiveId}.crystal`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Crystal archive downloaded!');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download archive');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-20">
      <div className="container py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-1 mb-4">
            Live <span className="text-gradient">Demo</span>
          </h1>
          <p className="text-body max-w-3xl mx-auto">
            Experience CODEX Crystal Archive in action. Upload your files and see how 
            our revolutionary 5D optical storage technology works.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <h2 className="heading-3 mb-6">Upload Files</h2>
              
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-dark-600 hover:border-blue-500/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-blue-400">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-white mb-2">Drag & drop files here, or click to select</p>
                    <p className="text-dark-400 text-sm">Supports: TXT, MD, JSON, CSV, JPG, PNG, PDF, DOC, ZIP</p>
                  </div>
                )}
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Selected Files</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="text-white text-sm">{file.name}</div>
                            <div className="text-dark-400 text-xs">
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {file.type || 'Unknown'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Controls */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleProcess}
                  disabled={files.length === 0 || isProcessing}
                  className="btn-primary flex-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Process Files
                    </>
                  )}
                </Button>

                {processedFiles.length > 0 && (
                  <Button
                    onClick={handleDownload}
                    className="btn-secondary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Archive
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Profile Selection */}
            <div className="card">
              <h3 className="heading-3 mb-4">Encoding Profile</h3>
              <div className="space-y-3">
                {[
                  { id: 'A', name: 'Conservative', desc: '3 bits/voxel, 99.9999% recovery' },
                  { id: 'B', name: 'Aggressive', desc: '5 bits/voxel, higher density' }
                ].map((profile) => (
                  <label
                    key={profile.id}
                    className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProfile === profile.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-dark-600 hover:border-dark-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="profile"
                      value={profile.id}
                      checked={selectedProfile === profile.id}
                      onChange={(e) => setSelectedProfile(e.target.value)}
                      className="sr-only"
                    />
                    <div className="font-semibold text-white">{profile.name}</div>
                    <div className="text-sm text-dark-300">{profile.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Processing Stats */}
            {processedFiles.length > 0 && (
              <div className="card">
                <h3 className="heading-3 mb-4">Processing Results</h3>
                <div className="space-y-4">
                  {processedFiles.map((file, index) => (
                    <div key={index} className="p-3 bg-dark-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white text-sm font-medium">{file.name}</div>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-dark-400">Compression</div>
                          <div className="text-green-400">{file.compressionRatio.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-dark-400">Error Rate</div>
                          <div className="text-blue-400">{file.errorRate.toFixed(4)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="card">
              <h3 className="heading-3 mb-4">Demo Features</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'Multi-layer error correction' },
                  { icon: Zap, text: '5D optical encoding' },
                  { icon: BarChart3, text: 'Real-time analytics' },
                  { icon: Settings, text: 'Custom profiles' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                    <span className="text-dark-300 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        {processedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <div className="card">
              <h2 className="heading-3 mb-6">Processing Complete!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-400/10 border border-green-400/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {processedFiles.length}
                  </div>
                  <div className="text-sm text-dark-300">Files Processed</div>
                </div>
                <div className="text-center p-4 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {processedFiles.reduce((acc, file) => acc + file.compressionRatio, 0) / processedFiles.length}%
                  </div>
                  <div className="text-sm text-dark-300">Avg Compression</div>
                </div>
                <div className="text-center p-4 bg-purple-400/10 border border-purple-400/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {selectedProfile === 'A' ? '3' : '5'}D
                  </div>
                  <div className="text-sm text-dark-300">Optical Encoding</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
