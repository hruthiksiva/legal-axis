export interface ChatMessage {
  messageId: string;
  senderId: string;
  text: string;
  timestamp: any; // Firestore Timestamp
}

export interface CaseChat {
  caseId: string;
  participants: [string, string]; // [clientId, lawyerId]
  messages: ChatMessage[];
  lastUpdated: any; // Firestore Timestamp
} 