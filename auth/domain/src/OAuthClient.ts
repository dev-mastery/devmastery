export interface TokenRequest {
  url: string;
  body?: string;
  headers: {
    [key: string]: string;
  };
  method: "POST" | "GET";
}

export interface LoginResponse {
  status: number;
  headers: {
    [key: string]: string;
  };
}

export interface UserInfo {
  sub: string | number;
  name?: string;
  email?: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
  locale?: string;
  updated_at?: string;
  emailVerified?: boolean;
  profile?: string;
  website?: string;
  [key: string]: any;
}

export interface GetLoginResponseProps {
  loginUrl: string;
  redirectUrl: string;
  scope: string;
  state: string;
}

export interface GetTokenRequestProps {
  stateSent: string;
  stateReceived: string;
  code: string;
  secret: string;
  tokenUrl: string;
  redirectUrl: string;
}

export interface UserInfoRequest {
  url: string;
  headers: {
    Authorization: string;
    Accept?: string;
  };
}

export interface GetUserInfoRequestProps {
  accessToken: string;
}

export type MapUserInfoProps = Record<string, any>;

export abstract class OAuthClient {
  #clientId: string;

  protected constructor({ clientId }: { clientId: string }) {
    this.#clientId = clientId;
  }

  protected get clientId(): string {
    return this.#clientId;
  }

  public abstract getLoginResponse({
    loginUrl,
    redirectUrl,
    scope,
    state,
  }: GetLoginResponseProps): LoginResponse;

  public abstract getTokenRequest({
    stateSent,
    stateReceived,
    code,
    redirectUrl,
    secret,
    tokenUrl,
  }: GetTokenRequestProps): TokenRequest;

  public abstract getUserInfoRequest({
    accessToken,
  }: GetUserInfoRequestProps): UserInfoRequest;

  public abstract mapUserInfo(info: MapUserInfoProps): UserInfo;
}
