import {
  NonEmptyString,
  RandomString,
  PositiveInteger,
} from "@devmastery/common-domain";

interface JWTUtil {
  sign(options: Record<string, any>, secret: string): string;
}

interface LoginWithGithubProps {
  clientId: NonEmptyString;
  clientSecret: NonEmptyString;
  jwtSecret: NonEmptyString;
  jwtUtil: JWTUtil;
  redirectUri: URL;
}

interface LoginOptions {
  state: string;
  postLoginRedirect: string;
}

type sendHttpResponse = ({
  status,
  headers,
}: {
  status: number;
  headers: Record<string, any>;
}) => void;

export class LoginWithGithub {
  #authorizationEndpoint: string = "https://github.com/login/oauth/authorize";
  #clientId: string;
  #clientSecret: string;
  #jwtSecret: string;
  #jwtUtil: JWTUtil;
  #redirectUri: string;
  #postLoginRedirect: string = "/admin";
  #tokenEndpoint: string = "https://github.com/login/oauth/access_token";
  #userInfoEndpoint: string = "https://api.github.com/user";
  #loginOptionsKey: string = "LOGIN_OPTS";

  public static init(props: LoginWithGithubProps) {
    return new LoginWithGithub(props);
  }

  private constructor(props: LoginWithGithubProps) {
    this.#clientId = props.clientId.value;
    this.#clientSecret = props.clientSecret.value;
    this.#jwtSecret = props.jwtSecret.value;
    this.#jwtUtil = props.jwtUtil;
    this.#redirectUri = props.redirectUri.href;
  }

  public async login({
    postLoginRedirect,
    callback,
  }: {
    postLoginRedirect?: URL;
    callback: sendHttpResponse;
  }) {
    const state = RandomString.from({ length: PositiveInteger.of(32) });
    const loginOptions = JSON.stringify({
      state: state.value,
      postLoginRedirect: postLoginRedirect.href ?? this.#postLoginRedirect,
    });

    const loginUrl = new URL(this.#authorizationEndpoint);
    loginUrl.searchParams.set("client_id", this.#clientId);
    loginUrl.searchParams.set("redirect_uri", this.#redirectUri);
    loginUrl.searchParams.set("scope", "user:email read:user");
    loginUrl.searchParams.set("state", state.value);
    loginUrl.searchParams.set("response_type", "code");

    const cookieKey = this.#loginOptionsKey;
    const cookieValue = encodeURIComponent(loginOptions);

    const loginResponse = {
      status: 302,
      headers: {
        "Set-Cookie": `${cookieKey}=${cookieValue}; SameSite=Lax; HttpOnly`,
        Location: loginUrl.href,
      },
    };

    callback(loginResponse);
  }

  // public async getTokens({
}
