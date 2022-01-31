import { Form, ActionFunction, redirect, LoaderFunction } from "remix";
import { RandomString, PositiveInteger } from "@devmastery/common-domain";
import { authStateCookie } from "~/cookies";
import { FaGithub } from "react-icons/fa";

export const action: ActionFunction = async ({ request, context, params }) => {
  const clientId = process.env["OAUTH_CLIENT_ID"]!;
  const loginUrlString = process.env["OAUTH_LOGIN_URL"]!;
  const redirectUrl = process.env["OAUTH_REDIRECT_URL"]!;
  const scope = process.env["OAUTH_SCOPE"]!;
  const stateLength = PositiveInteger.of(32);
  const state = RandomString.from({ length: stateLength }).value;
  let loginUrl = new URL(loginUrlString);
  loginUrl.searchParams.set("client_id", clientId);
  loginUrl.searchParams.set("redirect_uri", redirectUrl);
  loginUrl.searchParams.set("scope", scope);
  loginUrl.searchParams.set("state", state);

  const formData = await request.formData();
  const inputs = Object.fromEntries(formData);
  const provider = inputs["provider"];
  console.log("provider", provider);

  return redirect(loginUrl.href, {
    status: 302,
    headers: {
      "Set-Cookie": await authStateCookie.serialize(state),
    },
  });
};

export default function Login() {
  return (
    <Form
      method="post"
      action="/login"
      style={{
        display: "grid",
        marginTop: "10%",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "var(--text-color)",
          marginBottom: "36px",
        }}
      >
        Please sign in
        <br /> or create a free account
      </h1>
      <button
        name="provider"
        value="github"
        id="btnLoginWithGithub"
        type="submit"
        style={
          {
            backgroundColor: "#0284c7",
            color: "white",
            border: "none",
            minHeight: "40px",
            minWidth: "360px",
            fontSize: "16px",
            borderRadius: "4px",
            margin: "0 auto",
            lineHeight: "40px",
            textAlign: "center",
            cursor: "pointer",
            verticalAlign: "middle",
            boxShadow: "0 0 6px rgba(0,0,0,0.5)",
          } as React.CSSProperties
        }
      >
        <FaGithub
          size={24}
          style={{
            marginRight: "12px",
            marginBottom: "2px",
            verticalAlign: "middle",
          }}
        ></FaGithub>{" "}
        Sign In (or up) with GitHub
      </button>
    </Form>
  );
}
