export interface Responses {
  id?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  formId: string;
  answers: Answer[];
  createdAt?: Date;
}

export interface Answer {
  id?: string;
  responseId?: string;
  questionId: string;
  questionText: string;
  questionType: string;
  questionOptions: string[];
  questionAnswer?: string;
  questionOrder: number;
  responseAnswer: string;
}

export interface ResponsesOutput {
  message: string;
  data: {
    responses: Responses[];
    total: number;
    page: number;
    pageSize: number;
  };
}
