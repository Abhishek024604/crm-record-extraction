"use client";
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ImportModal from '@/components/ImportModal';
import PreviewTable from '@/components/PreviewTable';

export default function Home() {
  const router = useRouter();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File, data: any[], headers: string[]) => {
    setSelectedFile(file);
    setPreviewData(data);
    setPreviewHeaders(headers);
    setShowImportModal(false);
    setShowPreview(true);
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Store results and navigate to Manage Leads tab
      sessionStorage.setItem('importedLeads', JSON.stringify(response.data));
      setShowPreview(false);
      setSelectedFile(null);
      router.push('/manage-leads');
    } catch (error: any) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.error || "Failed to process file. Check backend logs.";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lead Sources</h1>
        <p className="text-gray-500 mt-1">Connect, manage, and control all your lead channels from one dashboard.</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center max-w-3xl cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setShowImportModal(true)}>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-teal-600">
          <Upload size={24} />
        </div>
        <h3 className="text-lg font-bold">Import Leads via CSV</h3>
        <p className="text-gray-500 text-sm mt-1">Upload a CSV file to bulk import leads into your system.</p>
      </div>

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onFileSelect={handleFileSelect}
        />
      )}

      {showPreview && selectedFile && (
        <PreviewTable
          file={selectedFile}
          data={previewData}
          headers={previewHeaders}
          onCancel={() => {
            setShowPreview(false);
            setSelectedFile(null);
          }}
          onConfirm={handleConfirmImport}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}
