export interface FormOutput {
  message: string;
  data: {
    forms: Form[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface FormOutputWithId {
  message: string;
  data: Form;
}

export interface Form {
  id: string;
  userId: string;
  title: string;
  description: string;
  logoUrl: string | null;
  isSinglePage: boolean;
  noOfPages: number;
  questions: Question[];
  styling?: Styling;
  privateSharingToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Styling {
  pageColor: string;
  pageImage?: string;
  formColor: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
}

export interface Question {
  id: string;
  formId: string;
  validations: JSON;
  pageNumber: number;
  questionType: string;
  questionText: string;
  questionOptions: string[];
  questionAnswer?: string;
  questionOrder: number;
  isRequired: boolean;
  isHidden: boolean;
  action?: string;
  condition?: string;
  ConditionalLogic?: conditionalLogic[];
  createdAt: string;
  updatedAt: string;
}

export interface conditionalLogic {
  id: string;
  formId: string;
  questionId: string;
  operator: string;
  value: string;
  action_questionId: string[];
}
