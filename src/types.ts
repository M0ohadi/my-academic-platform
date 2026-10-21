export type ServiceCategory = 'writing' | 'methodology' | 'analysis' | 'integrity';

export interface AcademicService {
  id: string;
  number: number;
  title: string;
  englishTitle: string;
  category: ServiceCategory;
  categoryLabel: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  sampleInput: string;
  samplePromptExplanation: string;
  targetFields: string[];
  options: {
    hasToneSelect?: boolean;
    hasCitationSelect?: boolean;
    hasSoftwareSelect?: boolean;
    hasDegreeSelect?: boolean;
  };
}

export interface ProcessingHistoryItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  timestamp: string;
  inputSnippet: string;
  result: string;
}
