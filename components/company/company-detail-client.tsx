import React from 'react';

interface CompanyDetailClientProps {
  // Add any props you expect; leaving empty for now
    company: {
    name: string;
    evaluationCriteria: string[];
    interviewFormat: string;
    // ...other fields
  };
  userStories: UserStory[];
}

const CompanyDetailClient: React.FC<CompanyDetailClientProps> = ({ company, userStories }) => {
  // Placeholder component until real implementation is added
  return null;
};

export default CompanyDetailClient;
