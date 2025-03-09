/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      name
      editor
      admin
      logid
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      name
      editor
      admin
      logid
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      name
      editor
      admin
      logid
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateAgendas = /* GraphQL */ `
  subscription OnCreateAgendas($filter: ModelSubscriptionAgendasFilterInput) {
    onCreateAgendas(filter: $filter) {
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
export const onUpdateAgendas = /* GraphQL */ `
  subscription OnUpdateAgendas($filter: ModelSubscriptionAgendasFilterInput) {
    onUpdateAgendas(filter: $filter) {
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
export const onDeleteAgendas = /* GraphQL */ `
  subscription OnDeleteAgendas($filter: ModelSubscriptionAgendasFilterInput) {
    onDeleteAgendas(filter: $filter) {
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
export const onCreateMessages = /* GraphQL */ `
  subscription OnCreateMessages($filter: ModelSubscriptionMessagesFilterInput) {
    onCreateMessages(filter: $filter) {
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
export const onUpdateMessages = /* GraphQL */ `
  subscription OnUpdateMessages($filter: ModelSubscriptionMessagesFilterInput) {
    onUpdateMessages(filter: $filter) {
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
export const onDeleteMessages = /* GraphQL */ `
  subscription OnDeleteMessages($filter: ModelSubscriptionMessagesFilterInput) {
    onDeleteMessages(filter: $filter) {
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
export const onCreateParagraphes = /* GraphQL */ `
  subscription OnCreateParagraphes(
    $filter: ModelSubscriptionParagraphesFilterInput
  ) {
    onCreateParagraphes(filter: $filter) {
      id
      text
      title
      order
      Images {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateParagraphes = /* GraphQL */ `
  subscription OnUpdateParagraphes(
    $filter: ModelSubscriptionParagraphesFilterInput
  ) {
    onUpdateParagraphes(filter: $filter) {
      id
      text
      title
      order
      Images {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteParagraphes = /* GraphQL */ `
  subscription OnDeleteParagraphes(
    $filter: ModelSubscriptionParagraphesFilterInput
  ) {
    onDeleteParagraphes(filter: $filter) {
      id
      text
      title
      order
      Images {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateImages = /* GraphQL */ `
  subscription OnCreateImages($filter: ModelSubscriptionImagesFilterInput) {
    onCreateImages(filter: $filter) {
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
export const onUpdateImages = /* GraphQL */ `
  subscription OnUpdateImages($filter: ModelSubscriptionImagesFilterInput) {
    onUpdateImages(filter: $filter) {
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
export const onDeleteImages = /* GraphQL */ `
  subscription OnDeleteImages($filter: ModelSubscriptionImagesFilterInput) {
    onDeleteImages(filter: $filter) {
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
export const onCreateArticles = /* GraphQL */ `
  subscription OnCreateArticles($filter: ModelSubscriptionArticlesFilterInput) {
    onCreateArticles(filter: $filter) {
      id
      titles
      rubrique
      caroussel
      Images {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateArticles = /* GraphQL */ `
  subscription OnUpdateArticles($filter: ModelSubscriptionArticlesFilterInput) {
    onUpdateArticles(filter: $filter) {
      id
      titles
      rubrique
      caroussel
      Images {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteArticles = /* GraphQL */ `
  subscription OnDeleteArticles($filter: ModelSubscriptionArticlesFilterInput) {
    onDeleteArticles(filter: $filter) {
      id
      titles
      rubrique
      caroussel
      Images {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
