import { LoaderFunction, redirect } from "remix";
import { authStateCookie } from "~/cookies";
import fetch from "cross-fetch";

export const loader: LoaderFunction = async ({ request, context }) => {
  const incomingRequestUrl = new URL(request.url);
  const code = incomingRequestUrl.searchParams.get("code");
  const client_id = process.env["OAUTH_CLIENT_ID"]!;
  const client_secret = process.env["OAUTH_CLIENT_SECRET"]!;
  const redirectUrl = process.env["OAUTH_REDIRECT_URL"]!;
  const cookieHeader = request.headers.get("Cookie");
  const stateFromRequest = incomingRequestUrl.searchParams.get("state");
  const stateFromCookie = await authStateCookie.parse(cookieHeader);

  if (stateFromRequest !== stateFromCookie) {
    throw new Error("Invalid state");
  }

  let tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${encodeURIComponent(
        redirectUrl
      )}`,
    }
  );

  let resp = await tokenResponse.json();
  console.log("token", resp);
  let userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/json",
      Authorization: `token ${resp.access_token}`,
    },
  });

  return userResponse.json();
};
