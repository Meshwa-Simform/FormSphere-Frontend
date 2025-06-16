export interface FormOutput{
    message: string,
    data: Form[],
}

export interface FormOutputWithId{
    message: string,
    data: Form,
}

export interface Form{
    id: string,
    userId: string,
    title: string,
    description: string,
    logoUrl: string|null,
    isSinglePage: boolean,
    noOfPages: number,
    questions: Question[],
    styling?: Styling,
    privateSharingToken?: string,
    conditionalLogic?: conditionalLogic,
    createdAt: string,
    updatedAt: string,
}

export interface Styling{
    PageColor: string,
    PageImage?: string,
    formColor: string,
    fontColor: string,
    fontFamily: string,
    fontSize: number,
}

export interface Question{
    id: string,
    formId: string,
    validations: string[],
    pageNumber: number,
    questionType:string,
    questionText: string,
    questionOptions: string[],
    questionAnswer?: string,
    questionOrder: number,
    isRequired: boolean,
    isHidden: boolean,
    conditionalLogic?: conditionalLogic[],
    createdAt: string,
    updatedAt: string,
}

export interface conditionalLogic{
    id: string,
    formId: string,
    questionId: string,
    condition_check: string,
    action_questionId: string[]
}