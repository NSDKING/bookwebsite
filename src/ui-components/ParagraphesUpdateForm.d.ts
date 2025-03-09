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
export declare type ParagraphesUpdateFormInputValues = {
    text?: string;
    title?: string;
    order?: string;
};
export declare type ParagraphesUpdateFormValidationValues = {
    text?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    order?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ParagraphesUpdateFormOverridesProps = {
    ParagraphesUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    text?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ParagraphesUpdateFormProps = React.PropsWithChildren<{
    overrides?: ParagraphesUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    paragraphes?: any;
    onSubmit?: (fields: ParagraphesUpdateFormInputValues) => ParagraphesUpdateFormInputValues;
    onSuccess?: (fields: ParagraphesUpdateFormInputValues) => void;
    onError?: (fields: ParagraphesUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ParagraphesUpdateFormInputValues) => ParagraphesUpdateFormInputValues;
    onValidate?: ParagraphesUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ParagraphesUpdateForm(props: ParagraphesUpdateFormProps): React.ReactElement;
