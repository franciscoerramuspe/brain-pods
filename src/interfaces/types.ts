export interface TextContext {
  title: string;
  text: string;
}

export interface SocketMessage {
  type: string;
  data: CardMessage | ChatMessage;
}

export interface CardAnswer {
  answer: string;
  correct: boolean;
}

export interface CardMessage {
  question: string;
  answers: CardAnswer[];
}

export interface ChatMessage {
  message: string;
}
