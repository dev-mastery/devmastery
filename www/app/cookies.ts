import { createCookie } from "remix";

export const authStateCookie = createCookie("authState", {
  maxAge: 60 * 10,
  httpOnly: true,
});
