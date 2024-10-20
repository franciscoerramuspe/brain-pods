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

export interface AnswerOption {
  answer: string;
  is_correct: boolean;
}

export interface CardMessage {
  question: string;
  answers: AnswerOption[];
  id: string;
}

export interface ChatMessage {
  message: string;
}

export interface PodAnswer {
  user_id: string;
  pod_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
}
