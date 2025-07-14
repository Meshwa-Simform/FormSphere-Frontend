import { Styling } from '../../create-forms/interface/form';

export interface TemplateOutput {
  id: string;
  title: string;
  description: string;
  logoUrl: string | null;
  isSinglePage: boolean;
  noOfPages: number;
  styling: Styling;
  privateSharingToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  questions: {
    id: string;
    formId: string | null;
    templateId: string | null;
    pageNumber: number;
    questionType: string;
    questionText: string;
    questionOptions: string[];
    validations: JSON;
    questionAnswer: string | null;
    questionOrder: number;
    isRequired: boolean;
    isHidden: boolean;
    action?: string;
    condition?: string;
    ConditionalLogic?: conditionalLogic[];
  }[];
}

export interface conditionalLogic {
  id: string;
  formId: string;
  questionId: string;
  operator: string;
  value: string;
  action_questionId: string[];
}