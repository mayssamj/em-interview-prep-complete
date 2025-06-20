// Add this at the top if you have a UserStory type elsewhere
// import { UserStory } from '@/types/user-story';

// Or define it here for now:
type UserStory = {
  id: string;
  // Add other fields as needed
  createdAt: string;
  // ...
};

export interface CompanyDetailClientProps {
  company: {
    name: string;
    evaluationCriteria: string[];
    interviewFormat: string;
    successTips: string[];
    redFlags: string[];
    questions: {
      id: string;
      category: string;
      questionText: string;
      difficulty: string;
      tags: string[];
      isCritical: boolean;
    }[];
    // Add any other fields expected from company
  };
  userStories: UserStory[];
}

const CompanyDetailClient: React.FC<CompanyDetailClientProps> = ({ company, userStories }) => {
  // Implementation
  return null;
};

export default CompanyDetailClient;
