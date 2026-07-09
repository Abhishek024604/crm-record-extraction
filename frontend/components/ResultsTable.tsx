"use client";
import React from 'react';

interface ResultsTableProps {
  results: {
    total: number;
    successful: number;
    skipped: number;
    records: any[];
  };
  onClose: () => void;
}

const ResultsTable = ({ results, onClose }: ResultsTableProps) => {
  const importedRecords = results.records.filter(r => r.__status !== 'skipped');
  const skippedRecords = results.records.filter(r => r.__status === 'skipped');

  const renderTable = (records: any[], title: string, emptyMessage: string, isSkipped: boolean = false) => (
    <div className="mb-8">
      <h3 className={`text-lg font-bold mb-3 ${isSkipped ? 'text-orange-700' : 'text-gray-800'}`}>
        {title} ({records.length})
      </h3>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col max-h-[500px]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-xs whitespace-nowrap relative">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">Created At</th>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">Name</th>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">Email</th>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">Mobile</th>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">Company</th>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">Lead Owner</th>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">CRM Status</th>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">Source</th>
                <th className="px-6 py-2 font-bold text-xs uppercase text-gray-600 tracking-wider bg-gray-50">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 transition-colors ${isSkipped ? 'bg-orange-50/20' : ''}`}>
                  <td className="px-6 py-3">{record.created_at ? new Date(record.created_at).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-3 font-medium">{record.name || '-'}</td>
                  <td className="px-6 py-3">{record.email || '-'}</td>
                  <td className="px-6 py-3">{record.mobile_without_country_code ? `+${(record.country_code || '').replace('+', '')} ${record.mobile_without_country_code}` : '-'}</td>
                  <td className="px-6 py-3">{record.company || '-'}</td>
                  <td className="px-6 py-3 font-medium text-gray-700">{record.lead_owner || '-'}</td>
                  <td className="px-6 py-3">
                    {record.crm_status ? (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${record.crm_status === 'SALE_DONE' ? 'bg-[#e8f0fe] text-[#1a73e8] border-transparent' :
                        record.crm_status === 'GOOD_LEAD_FOLLOW_UP' ? 'bg-[#e6f4ea] text-[#1e8e3e] border-transparent' :
                          record.crm_status === 'BAD_LEAD' ? 'bg-red-50 text-red-600 border-transparent' :
                            'bg-[#f1f3f4] text-[#5f6368] border-transparent'
                        }`}>
                        {record.crm_status.replace(/_/g, ' ')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#f1f3f4] text-[#5f6368] border-transparent">
                        Not Dialed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">{record.data_source || '-'}</td>
                  <td className="px-6 py-3">
                    <div className="w-[250px] overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {record.crm_note || '-'}
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold">Import Results</h2>
          <div className="flex gap-4 mt-2">
            <span className="text-sm px-3 py-1 bg-gray-100 rounded-full font-medium">Total: {results.total}</span>
            <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Imported: {results.successful}</span>
            <span className="text-sm px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">Skipped: {results.skipped}</span>
          </div>
        </div>
        <button onClick={onClose} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
          Clear Results
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {renderTable(importedRecords, "Successfully Imported Leads", "No successfully imported leads.")}
        {skippedRecords.length > 0 && renderTable(skippedRecords, "Skipped Leads (Missing valid contact info)", "No skipped leads.", true)}
      </div>
    </div>
  );
};

export default ResultsTable;
