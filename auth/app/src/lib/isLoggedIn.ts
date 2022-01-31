interface AuthorizedRequest {
  headers: { Authorization: string; [key: string]: string };
  [key: string]: any;
}

export function isLoggedIn(req: AuthorizedRequest) {
  const auth = req?.headers["Authorization"];
  const token = auth?.split(" ")[1];
  const isValidToken = validateToken(token);
  return auth && token && isValidToken;
}

function validateToken(token: string) {
  if (!token) {
    return false;
  }
  return true;
}
