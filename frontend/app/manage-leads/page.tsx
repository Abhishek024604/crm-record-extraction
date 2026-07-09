"use client";
import React, { useEffect, useState } from 'react';
import ResultsTable from '@/components/ResultsTable';

export default function ManageLeads() {
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    // Check if we have results in sessionStorage from a recent upload
    const storedLeads = sessionStorage.getItem('importedLeads');
    if (storedLeads) {
      try {
        setResults(JSON.parse(storedLeads));
      } catch (e) {
        console.error("Failed to parse stored leads", e);
      }
    }
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Leads</h1>
        <p className="text-gray-500 mt-1">View, edit, and organize all your imported leads.</p>
      </div>

      {results ? (
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <ResultsTable 
            results={results} 
            onClose={() => {
              sessionStorage.removeItem('importedLeads');
              setResults(null);
            }} 
          />
        </div>
      ) : (
        <div className="flex-1 bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No leads available</h3>
          <p className="text-gray-500 mt-2 max-w-md">
            You haven't imported any leads recently. Head over to the Lead Sources tab to upload a new CSV file.
          </p>
        </div>
      )}
    </div>
  );
}
