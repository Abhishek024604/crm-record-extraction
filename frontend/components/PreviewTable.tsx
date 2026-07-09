"use client";
import React from 'react';
import { X, FileSpreadsheet, Loader2 } from 'lucide-react';

interface PreviewTableProps {
  file: File;
  data: any[];
  headers: string[];
  onCancel: () => void;
  onConfirm: () => void;
  isUploading: boolean;
}

const PreviewTable = ({ file, data, headers, onCancel, onConfirm, isUploading }: PreviewTableProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold">Import Leads via CSV</h2>
            <p className="text-sm text-gray-500 mt-1">Upload a CSV file to bulk import leads into your system.</p>
          </div>
          <button onClick={onCancel} disabled={isUploading} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 disabled:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 p-3 rounded-lg">
             <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-teal-600 shadow-sm">
               <FileSpreadsheet size={20} />
             </div>
             <div>
               <p className="text-sm font-semibold text-gray-800">{file.name}</p>
               <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB • Previewing first 10 rows</p>
             </div>
             <button onClick={onCancel} disabled={isUploading} className="ml-auto p-1.5 text-gray-400 hover:text-gray-600 rounded-full disabled:opacity-50">
               <X size={16} />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    {headers.map((header, idx) => (
                      <th key={idx} className="px-6 py-4 font-bold text-xs uppercase text-gray-600 tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                      {headers.map((header, colIdx) => (
                        <td key={colIdx} className="px-6 py-4 text-gray-700">
                          {row[header] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500">
                        No data found in the CSV.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center gap-4">
          <button 
            onClick={onCancel} 
            disabled={isUploading}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-black font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isUploading || data.length === 0}
            className="flex-1 py-3 rounded-xl bg-[#fcad8b] text-white font-bold hover:bg-[#fa9c74] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isUploading && <Loader2 size={18} className="animate-spin" />}
            {isUploading ? 'Processing...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewTable;
