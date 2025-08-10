export interface Question {
  id: string;
  text: string;
  parentId: string | null;
  children: Question[];
  level: number;
  isRoot: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  questionId?: string;
}