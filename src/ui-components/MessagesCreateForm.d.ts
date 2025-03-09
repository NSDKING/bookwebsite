/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type MessagesCreateFormInputValues = {
    mail?: string;
    name?: string;
    message?: string;
    numero?: string;
};
export declare type MessagesCreateFormValidationValues = {
    mail?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    message?: ValidationFunction<string>;
    numero?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MessagesCreateFormOverridesProps = {
    MessagesCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    mail?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    message?: PrimitiveOverrideProps<TextFieldProps>;
    numero?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MessagesCreateFormProps = React.PropsWithChildren<{
    overrides?: MessagesCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MessagesCreateFormInputValues) => MessagesCreateFormInputValues;
    onSuccess?: (fields: MessagesCreateFormInputValues) => void;
    onError?: (fields: MessagesCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MessagesCreateFormInputValues) => MessagesCreateFormInputValues;
    onValidate?: MessagesCreateFormValidationValues;
} & React.CSSProperties>;
export default function MessagesCreateForm(props: MessagesCreateFormProps): React.ReactElement;
