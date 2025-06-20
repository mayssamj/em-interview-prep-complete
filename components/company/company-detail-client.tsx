import React from 'react';

interface CompanyDetailClientProps {
  company: any; // TODO: replace `any` with a proper Company type when available
}

const CompanyDetailClient: React.FC<CompanyDetailClientProps> = ({ company }) => {
  // Temporary render so the app shows something useful
  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(company, null, 2)}</pre>
  );
};

export default CompanyDetailClient;
