import fetch from "cross-fetch";

import {
  RandomString,
  NonEmptyString,
  PositiveInteger,
} from "@devmastery/common-domain";

interface OAuthClientConfig {
  authorizationEndpoint: URL;
  clientId: NonEmptyString;
  clientSecret: NonEmptyString;
  redirectUri: URL;
  tokenEndpoint: URL;
  userInfoEndpoint: URL;
}

export class OAuthClient {
  #authorizationEndpoint: URL;
  #clientId: NonEmptyString;
  #clientSecret: NonEmptyString;
  #redirectUri: URL;
  #tokenEndpoint: URL;
  #userInfoEndpoint: URL;

  public static init(config: OAuthClientConfig) {
    return new OAuthClient(config);
  }

  private constructor(config: OAuthClientConfig) {
    this.#authorizationEndpoint = config.authorizationEndpoint;
    this.#clientId = config.clientId;
    this.#clientSecret = config.clientSecret;
    this.#redirectUri = config.redirectUri;
    this.#tokenEndpoint = config.tokenEndpoint;
    this.#userInfoEndpoint = config.userInfoEndpoint;
  }

  public getLoginResponse({
    state,
    scope,
  }: {
    state: NonEmptyString;
    scope: NonEmptyString;
  }) {
    let authUrl = new URL(this.#authorizationEndpoint);
    authUrl.searchParams.set("client_id", this.#clientId.value);
    authUrl.searchParams.set("redirect_uri", this.#redirectUri.href);
    authUrl.searchParams.set("scope", scope.value);
    authUrl.searchParams.set("state", state.value);
    authUrl.searchParams.set("response_type", "code");

    return {
      status: 302,
      headers: {
        "Set-Cookie": `state=${state.value}; HttpOnly`,
        Location: authUrl.href,
      },
    };
  }

  public async getToken({
    code,
    originalState,
    stateReceived,
  }: {
    code: NonEmptyString;
    originalState: RandomString;
    stateReceived: string;
  }) {
    if (stateReceived !== originalState.value) {
      throw new Error("State mismatch");
    }

    return fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${this.#clientId}&client_secret=${
        this.#clientSecret
      }&code=${code}`,
    });
  }
}
