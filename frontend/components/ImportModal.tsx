"use client";
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';

interface ImportModalProps {
  onClose: () => void;
  onFileSelect: (file: File, previewData: any[], headers: string[]) => void;
}

const ImportModal = ({ onClose, onFileSelect }: ImportModalProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        preview: 10,
        complete: (results) => {
          onFileSelect(file, results.data, results.meta.fields || []);
        }
      });
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[600px] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold">Import Leads via CSV</h2>
            <p className="text-xs text-gray-500 mt-1">Upload a CSV file to bulk import leads into your system.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div
            {...getRootProps()}
            className={`border border-dashed rounded-xl py-6 px-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-[#1c7865] bg-[#e6f4f1]' : 'border-gray-300 hover:border-[#1c7865] hover:bg-gray-50'
              }`}
          >
            <input {...getInputProps()} />
            <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-3 text-[#1c7865] shadow-sm">
              <Upload size={20} />
            </div>
            <h3 className="text-base font-bold mb-1 text-black">Drop your CSV file here</h3>
            <p className="text-gray-500 text-xs mb-3">or click to browse files</p>

            <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full mb-4">
              <FileSpreadsheet size={12} />
              <span>Supported file: .csv (max 5MB)</span>
            </div>

            <p className="text-[11px] text-gray-400 text-center max-w-sm leading-snug">
              Required headers: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note. Template includes default + custom CRM fields to reduce upload errors.
            </p>

            <button
              type="button"
              className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#1c7865] bg-[#e6f4f1] border border-[#d1e9e3] px-4 py-1.5 rounded-lg hover:bg-[#d1e9e3] transition-colors"
              onClick={(e) => { e.stopPropagation(); /* Implement template download logic */ }}
            >
              <FileSpreadsheet size={14} />
              Download Sample CSV Template
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-white flex justify-between items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-black font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled
            className="flex-1 py-2.5 rounded-xl bg-[#fcad8b] text-white font-bold text-sm opacity-70 cursor-not-allowed"
          >
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
