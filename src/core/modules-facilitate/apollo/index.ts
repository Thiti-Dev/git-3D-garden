import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { PUBLIC_GITHUB_API_KEY } from "../../../constants/variables";
import {
  ICreateApolloClientConnectionConfig,
  TCreateApolloClientConnectionConfigAuthTypes,
} from "./types";

export function createApolloClientConnection(
  uri: string,
  config?: ICreateApolloClientConnectionConfig
): ApolloClient<NormalizedCacheObject> {
  const httpLink: ApolloLink = createHttpLink({
    uri,
  });

  let authorizationCred: string = "";
  if (config?.authorization) {
    if (
      config.authorization ===
      TCreateApolloClientConnectionConfigAuthTypes.BEARER
    )
      authorizationCred = `Bearer ${PUBLIC_GITHUB_API_KEY}`;
  }

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authorizationCred,
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}
