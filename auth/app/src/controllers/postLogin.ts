import { PositiveInteger, RandomString } from "@devmastery/common-domain";

interface GenericHttpRequest {
  method: "POST" | "GET" | "DELETE" | "PUT" | "PATCH";
  url: string;
  body?: any;
  headers?: Map<string, string>;
  params?: Map<string, string>;
  query?: Map<string, string>;
}

interface GenericHttpResponse {
  status: number;
  headers: Record<string, string>;
  body?: any;
}

interface OAuthClient {
  getLoginResponse(): GenericHttpResponse;
}

export async function postLogin({
  url,
  query,
  body,
}: GenericHttpRequest): Promise<GenericHttpResponse> {
  if (!url?.length) {
    throw new Error("URL is required");
  }
  const provider = body?.provider?.trim().toLowerCase();
  if (provider == null) {
    return {
      status: 400,
      body: { error: "provider is required" },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  const target = body?.target?.trim().toLowerCase();
  let cookieString;
  if (target) {
    cookieString += `; AFTER_LOGIN=${target}; HttpOnly`;
  }

  if (provider === "github") {
    return redirectToGithubLogin(cookieString);
  }
}

function redirectToGithubLogin(cookieString?: string) {
  const clientId = process.env["GITHUB_OAUTH_CLIENT_ID"]!;
  const authorizeEndpoint = "https://github.com/login/oauth/authorize";
  const redirectUrl = process.env["GITHUB_OAUTH_REDIRECT_URL"]!;
  const scope = "user:email read:user";
  const stateLength = PositiveInteger.of(32);
  const state = RandomString.from({ length: stateLength }).value;

  let authUrl = new URL(authorizeEndpoint);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUrl);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);

  let cookie = cookieString ?? "";
  cookie += `AUTH_STATE=${state}; HttpOnly`;

  return {
    status: 302,
    headers: {
      "Set-Cookie": cookie,
      Location: authUrl.href,
    },
  };
}
