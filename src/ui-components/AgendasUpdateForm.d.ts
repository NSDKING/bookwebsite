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
export declare type AgendasUpdateFormInputValues = {
    name?: string;
    date?: string;
    description?: string;
    image?: string;
};
export declare type AgendasUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    image?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AgendasUpdateFormOverridesProps = {
    AgendasUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    image?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AgendasUpdateFormProps = React.PropsWithChildren<{
    overrides?: AgendasUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    agendas?: any;
    onSubmit?: (fields: AgendasUpdateFormInputValues) => AgendasUpdateFormInputValues;
    onSuccess?: (fields: AgendasUpdateFormInputValues) => void;
    onError?: (fields: AgendasUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AgendasUpdateFormInputValues) => AgendasUpdateFormInputValues;
    onValidate?: AgendasUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AgendasUpdateForm(props: AgendasUpdateFormProps): React.ReactElement;
