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
    validations: string[];
    questionAnswer: string | null;
    questionOrder: number;
    isRequired: boolean;
    isHidden: boolean;
  }[];
}
