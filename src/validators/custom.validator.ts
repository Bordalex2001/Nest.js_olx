import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class CustomValidator implements ValidatorConstraintInterface{
    validate(
        value: any, 
        validationArguments?: ValidationArguments
    ): Promise<boolean> | boolean {
        return !value.endsWith('mail.ru');
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Emails, end with mail.ru, not allowed!';
    }
}