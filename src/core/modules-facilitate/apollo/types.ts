export enum TCreateApolloClientConnectionConfigAuthTypes {
  BEARER = "Bearer",
}

export type ICreateApolloClientConnectionConfig =
  ICreateApolloClientConnectionConfigBase &
    (
      | ICreateApolloClientConnectionConfigNoAuthorization
      | ICreateApolloClientConnectionConfigWithAuthorization
    );

interface ICreateApolloClientConnectionConfigBase {}

interface ICreateApolloClientConnectionConfigNoAuthorization {
  authorization?: never;
}

interface ICreateApolloClientConnectionConfigWithAuthorization {
  authorization: TCreateApolloClientConnectionConfigAuthTypes;
  token: string;
}
