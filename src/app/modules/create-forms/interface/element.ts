export interface Element {
    id?: string,
    label:string, 
    icon:string,
    type: string, 
    placeholder?:string,
    options?: string[],
    outLabel: string,
    defaultValue?: string,
    isRequired?: boolean,
}
