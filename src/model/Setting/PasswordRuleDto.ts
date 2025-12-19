export interface PasswordRuleDto{
    len:number;
    isUpper:boolean;
    isLower:boolean;
    isSymbol:boolean;
    isDigit:boolean;
    weaks:string[];
}