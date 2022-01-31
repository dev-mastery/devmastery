# The @env pragma is synced (and overwritten) by running arc env
@env
testing
  REMIX_ENV development
  OAUTH_CLIENT_ID "83c62a4c580821ac1485"
  OAUTH_LOGIN_URL "https://github.com/login/oauth/authorize"
  OAUTH_CLIENT_SECRET "437dc6f8e95f694770fc58a15b6aeeaed6052311"
  OAUTH_REDIRECT_URL "http://localhost:3333/authorize"
  OAUTH_SCOPE "user:email read:user"
staging
  REMIX_ENV production

production
  REMIX_ENV production
