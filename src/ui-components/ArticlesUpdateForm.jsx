/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getArticles } from "../graphql/queries";
import { updateArticles } from "../graphql/mutations";
const client = generateClient();
export default function ArticlesUpdateForm(props) {
  const {
    id: idProp,
    articles: articlesModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    titles: "",
    rubrique: "",
    caroussel: false,
  };
  const [titles, setTitles] = React.useState(initialValues.titles);
  const [rubrique, setRubrique] = React.useState(initialValues.rubrique);
  const [caroussel, setCaroussel] = React.useState(initialValues.caroussel);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = articlesRecord
      ? { ...initialValues, ...articlesRecord }
      : initialValues;
    setTitles(cleanValues.titles);
    setRubrique(cleanValues.rubrique);
    setCaroussel(cleanValues.caroussel);
    setErrors({});
  };
  const [articlesRecord, setArticlesRecord] = React.useState(articlesModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getArticles.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getArticles
        : articlesModelProp;
      setArticlesRecord(record);
    };
    queryData();
  }, [idProp, articlesModelProp]);
  React.useEffect(resetStateValues, [articlesRecord]);
  const validations = {
    titles: [],
    rubrique: [],
    caroussel: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          titles: titles ?? null,
          rubrique: rubrique ?? null,
          caroussel: caroussel ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateArticles.replaceAll("__typename", ""),
            variables: {
              input: {
                id: articlesRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ArticlesUpdateForm")}
      {...rest}
    >
      <TextField
        label="Titles"
        isRequired={false}
        isReadOnly={false}
        value={titles}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              titles: value,
              rubrique,
              caroussel,
            };
            const result = onChange(modelFields);
            value = result?.titles ?? value;
          }
          if (errors.titles?.hasError) {
            runValidationTasks("titles", value);
          }
          setTitles(value);
        }}
        onBlur={() => runValidationTasks("titles", titles)}
        errorMessage={errors.titles?.errorMessage}
        hasError={errors.titles?.hasError}
        {...getOverrideProps(overrides, "titles")}
      ></TextField>
      <TextField
        label="Rubrique"
        isRequired={false}
        isReadOnly={false}
        value={rubrique}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              titles,
              rubrique: value,
              caroussel,
            };
            const result = onChange(modelFields);
            value = result?.rubrique ?? value;
          }
          if (errors.rubrique?.hasError) {
            runValidationTasks("rubrique", value);
          }
          setRubrique(value);
        }}
        onBlur={() => runValidationTasks("rubrique", rubrique)}
        errorMessage={errors.rubrique?.errorMessage}
        hasError={errors.rubrique?.hasError}
        {...getOverrideProps(overrides, "rubrique")}
      ></TextField>
      <SwitchField
        label="Caroussel"
        defaultChecked={false}
        isDisabled={false}
        isChecked={caroussel}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              titles,
              rubrique,
              caroussel: value,
            };
            const result = onChange(modelFields);
            value = result?.caroussel ?? value;
          }
          if (errors.caroussel?.hasError) {
            runValidationTasks("caroussel", value);
          }
          setCaroussel(value);
        }}
        onBlur={() => runValidationTasks("caroussel", caroussel)}
        errorMessage={errors.caroussel?.errorMessage}
        hasError={errors.caroussel?.hasError}
        {...getOverrideProps(overrides, "caroussel")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || articlesModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || articlesModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
