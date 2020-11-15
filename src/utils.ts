import { DATE_FORMAT_REGEX, PHONE_NUMBER_REGEX } from "consts";

export function validateEmptyString (value: string){
    if (!value?.trim()) {
        return 'This field can not be empty';
    }
}

export function validateDateFormat (value: string) {
    if(!DATE_FORMAT_REGEX.test(value)) {
        return 'Invalid date format';
    }
}

export function validatePhoneNumber (value: string) {
    if (!PHONE_NUMBER_REGEX.test(value)){
        return 'Invalid phone number'
    }
}
