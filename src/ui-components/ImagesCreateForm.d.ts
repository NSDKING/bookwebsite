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
export declare type ImagesCreateFormInputValues = {
    link?: string;
    description?: string;
    positions?: string;
};
export declare type ImagesCreateFormValidationValues = {
    link?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    positions?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ImagesCreateFormOverridesProps = {
    ImagesCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    link?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    positions?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ImagesCreateFormProps = React.PropsWithChildren<{
    overrides?: ImagesCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ImagesCreateFormInputValues) => ImagesCreateFormInputValues;
    onSuccess?: (fields: ImagesCreateFormInputValues) => void;
    onError?: (fields: ImagesCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ImagesCreateFormInputValues) => ImagesCreateFormInputValues;
    onValidate?: ImagesCreateFormValidationValues;
} & React.CSSProperties>;
export default function ImagesCreateForm(props: ImagesCreateFormProps): React.ReactElement;
