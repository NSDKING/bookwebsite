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
export declare type ImagesUpdateFormInputValues = {
    link?: string;
    description?: string;
    positions?: string;
};
export declare type ImagesUpdateFormValidationValues = {
    link?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    positions?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ImagesUpdateFormOverridesProps = {
    ImagesUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    link?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    positions?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ImagesUpdateFormProps = React.PropsWithChildren<{
    overrides?: ImagesUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    images?: any;
    onSubmit?: (fields: ImagesUpdateFormInputValues) => ImagesUpdateFormInputValues;
    onSuccess?: (fields: ImagesUpdateFormInputValues) => void;
    onError?: (fields: ImagesUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ImagesUpdateFormInputValues) => ImagesUpdateFormInputValues;
    onValidate?: ImagesUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ImagesUpdateForm(props: ImagesUpdateFormProps): React.ReactElement;
