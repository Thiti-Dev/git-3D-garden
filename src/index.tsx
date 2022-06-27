import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { createApolloClientConnection } from "./core/modules-facilitate/apollo";
import {
  GITHUB_GRAPHQL_ENDPOINT,
  PUBLIC_GITHUB_API_KEY,
} from "./constants/variables";
import { TCreateApolloClientConnectionConfigAuthTypes } from "./core/modules-facilitate/apollo/types";
import MainPage from "./pages/main";
import ViewFarm from "./pages/view-farm";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const apolloClient: ApolloClient<NormalizedCacheObject> =
  createApolloClientConnection(GITHUB_GRAPHQL_ENDPOINT, {
    authorization: TCreateApolloClientConnectionConfigAuthTypes.BEARER,
    token: PUBLIC_GITHUB_API_KEY,
  });
root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/view-farm/:username" element={<ViewFarm />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
