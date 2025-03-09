/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      editor
      admin
      logid
      Articles {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      editor
      admin
      logid
      Articles {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      editor
      admin
      logid
      Articles {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createAgendas = /* GraphQL */ `
  mutation CreateAgendas(
    $input: CreateAgendasInput!
    $condition: ModelAgendasConditionInput
  ) {
    createAgendas(input: $input, condition: $condition) {
      id
      name
      date
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateAgendas = /* GraphQL */ `
  mutation UpdateAgendas(
    $input: UpdateAgendasInput!
    $condition: ModelAgendasConditionInput
  ) {
    updateAgendas(input: $input, condition: $condition) {
      id
      name
      date
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteAgendas = /* GraphQL */ `
  mutation DeleteAgendas(
    $input: DeleteAgendasInput!
    $condition: ModelAgendasConditionInput
  ) {
    deleteAgendas(input: $input, condition: $condition) {
      id
      name
      date
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createMessages = /* GraphQL */ `
  mutation CreateMessages(
    $input: CreateMessagesInput!
    $condition: ModelMessagesConditionInput
  ) {
    createMessages(input: $input, condition: $condition) {
      id
      mail
      name
      message
      numero
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateMessages = /* GraphQL */ `
  mutation UpdateMessages(
    $input: UpdateMessagesInput!
    $condition: ModelMessagesConditionInput
  ) {
    updateMessages(input: $input, condition: $condition) {
      id
      mail
      name
      message
      numero
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteMessages = /* GraphQL */ `
  mutation DeleteMessages(
    $input: DeleteMessagesInput!
    $condition: ModelMessagesConditionInput
  ) {
    deleteMessages(input: $input, condition: $condition) {
      id
      mail
      name
      message
      numero
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createParagraphes = /* GraphQL */ `
  mutation CreateParagraphes(
    $input: CreateParagraphesInput!
    $condition: ModelParagraphesConditionInput
  ) {
    createParagraphes(input: $input, condition: $condition) {
      id
      text
      title
      order
      Images {
        nextToken
        __typename
      }
      articlesID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateParagraphes = /* GraphQL */ `
  mutation UpdateParagraphes(
    $input: UpdateParagraphesInput!
    $condition: ModelParagraphesConditionInput
  ) {
    updateParagraphes(input: $input, condition: $condition) {
      id
      text
      title
      order
      Images {
        nextToken
        __typename
      }
      articlesID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteParagraphes = /* GraphQL */ `
  mutation DeleteParagraphes(
    $input: DeleteParagraphesInput!
    $condition: ModelParagraphesConditionInput
  ) {
    deleteParagraphes(input: $input, condition: $condition) {
      id
      text
      title
      order
      Images {
        nextToken
        __typename
      }
      articlesID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createImages = /* GraphQL */ `
  mutation CreateImages(
    $input: CreateImagesInput!
    $condition: ModelImagesConditionInput
  ) {
    createImages(input: $input, condition: $condition) {
      id
      link
      description
      positions
      articlesID
      paragraphesID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateImages = /* GraphQL */ `
  mutation UpdateImages(
    $input: UpdateImagesInput!
    $condition: ModelImagesConditionInput
  ) {
    updateImages(input: $input, condition: $condition) {
      id
      link
      description
      positions
      articlesID
      paragraphesID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteImages = /* GraphQL */ `
  mutation DeleteImages(
    $input: DeleteImagesInput!
    $condition: ModelImagesConditionInput
  ) {
    deleteImages(input: $input, condition: $condition) {
      id
      link
      description
      positions
      articlesID
      paragraphesID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createArticles = /* GraphQL */ `
  mutation CreateArticles(
    $input: CreateArticlesInput!
    $condition: ModelArticlesConditionInput
  ) {
    createArticles(input: $input, condition: $condition) {
      id
      titles
      rubrique
      caroussel
      Images {
        nextToken
        __typename
      }
      userID
      Paragraphes {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateArticles = /* GraphQL */ `
  mutation UpdateArticles(
    $input: UpdateArticlesInput!
    $condition: ModelArticlesConditionInput
  ) {
    updateArticles(input: $input, condition: $condition) {
      id
      titles
      rubrique
      caroussel
      Images {
        nextToken
        __typename
      }
      userID
      Paragraphes {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteArticles = /* GraphQL */ `
  mutation DeleteArticles(
    $input: DeleteArticlesInput!
    $condition: ModelArticlesConditionInput
  ) {
    deleteArticles(input: $input, condition: $condition) {
      id
      titles
      rubrique
      caroussel
      Images {
        nextToken
        __typename
      }
      userID
      Paragraphes {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
