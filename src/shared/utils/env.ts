export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  oauthAuthorizeUrl: import.meta.env.VITE_OAUTH_AUTHORIZE_URL || "http://edu.com.br/auth",
  oauthClientId: import.meta.env.VITE_OAUTH_CLIENT_ID || "front"
};
