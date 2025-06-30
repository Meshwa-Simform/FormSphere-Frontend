export interface FormOutput{
    message: string,
    form: FormDetails,
}

export interface FormDetails{
    id?: string,
    userId?: string,
    title: string,
    description: string,
    logoUrl: string|null,
    isSinglePage: boolean,
    noOfPages: number,
    questions: Question[],
    styling?: Styling,
    privateSharingToken?: string,
    conditionalLogic?: conditionalLogic,
}

export interface Styling{
    pageColor: string,
    pageImage?: string,
    formColor: string,
    fontColor: string,
    fontFamily: string,
    fontSize: number,
}

export interface Question{
    id?: string,
    formId?: string,
    validations: string[],
    pageNumber: number,
    questionType:string,
    questionText: string,
    questionOptions: string[],
    questionAnswer?: string,
    questionOrder: number,
    isRequired: boolean,
    isHidden: boolean,
    conditionalLogic?: conditionalLogic,
}

export interface conditionalLogic{
    formId: string,
    questionId: string,
    condition_check: string,
    action_questionId: string[]
}