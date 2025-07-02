import { Validations } from "./form";

export interface Element {
  id?: string;
  label: string;
  icon: string;
  type: string;
  placeholder?: string;
  options?: string[];
  outLabel: string;
  defaultValue?: string;
  isRequired?: boolean;
  action?: string;
  condition?: string;
  conditionalLogic?: ConditionalLogic[];
  validations?: Validations;
}

export interface ConditionalLogic {
    operator: string;
    value: string;
    action_questionId: string[];
}