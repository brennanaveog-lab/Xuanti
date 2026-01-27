
export interface TopicCard {
  id: string;
  content: string;
  sourceUrls: Array<{ title: string; uri: string }>;
}

export interface SearchConfig {
  days: number;
  topicCount: number;
  industries: string[];
}

export enum LoadingStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  REASONING = 'REASONING',
  FORMATTING = 'FORMATTING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
