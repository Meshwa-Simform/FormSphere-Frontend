export interface FormOutput {
  message: string;
  form: FormDetails;
}

export interface FormDetails {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  logoUrl: string | null;
  isSinglePage: boolean;
  noOfPages: number;
  questions: Question[];
  styling?: Styling;
  privateSharingToken?: string;
}

export interface Styling {
  pageColor: string;
  pageImage?: string;
  formColor: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
}

export interface Validations {
  required?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  allowedChars?: string;
}

export interface Question {
  id?: string;
  formId?: string;
  validations: Validations; // <-- use Validations interface
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
  conditionalLogic?: conditionalLogic[];
}

export interface conditionalLogic {
  questionId?: string;
  operator: string;
  value: string;
  action_questionId: string[];
}
