/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        editor
        admin
        logid
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAgendas = /* GraphQL */ `
  query GetAgendas($id: ID!) {
    getAgendas(id: $id) {
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
export const listAgendas = /* GraphQL */ `
  query ListAgendas(
    $filter: ModelAgendasFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAgendas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        date
        description
        image
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMessages = /* GraphQL */ `
  query GetMessages($id: ID!) {
    getMessages(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        mail
        name
        message
        numero
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getParagraphes = /* GraphQL */ `
  query GetParagraphes($id: ID!) {
    getParagraphes(id: $id) {
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
export const listParagraphes = /* GraphQL */ `
  query ListParagraphes(
    $filter: ModelParagraphesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listParagraphes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        title
        order
        articlesID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const paragraphesByArticlesID = /* GraphQL */ `
  query ParagraphesByArticlesID(
    $articlesID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelParagraphesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    paragraphesByArticlesID(
      articlesID: $articlesID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        text
        title
        order
        articlesID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getImages = /* GraphQL */ `
  query GetImages($id: ID!) {
    getImages(id: $id) {
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
export const listImages = /* GraphQL */ `
  query ListImages(
    $filter: ModelImagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const imagesByArticlesID = /* GraphQL */ `
  query ImagesByArticlesID(
    $articlesID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelImagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    imagesByArticlesID(
      articlesID: $articlesID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const imagesByParagraphesID = /* GraphQL */ `
  query ImagesByParagraphesID(
    $paragraphesID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelImagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    imagesByParagraphesID(
      paragraphesID: $paragraphesID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getArticles = /* GraphQL */ `
  query GetArticles($id: ID!) {
    getArticles(id: $id) {
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
export const listArticles = /* GraphQL */ `
  query ListArticles(
    $filter: ModelArticlesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArticles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        titles
        rubrique
        caroussel
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const articlesByUserID = /* GraphQL */ `
  query ArticlesByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelArticlesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    articlesByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        titles
        rubrique
        caroussel
        userID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
