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
export declare type AgendasCreateFormInputValues = {
    name?: string;
    date?: string;
    description?: string;
    image?: string;
};
export declare type AgendasCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    image?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AgendasCreateFormOverridesProps = {
    AgendasCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    image?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AgendasCreateFormProps = React.PropsWithChildren<{
    overrides?: AgendasCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AgendasCreateFormInputValues) => AgendasCreateFormInputValues;
    onSuccess?: (fields: AgendasCreateFormInputValues) => void;
    onError?: (fields: AgendasCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AgendasCreateFormInputValues) => AgendasCreateFormInputValues;
    onValidate?: AgendasCreateFormValidationValues;
} & React.CSSProperties>;
export default function AgendasCreateForm(props: AgendasCreateFormProps): React.ReactElement;
