import { startTransition } from "react";

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`, // Or use 'common' for multi-tenant
    redirectUri: "http://localhost:3001", // Match this with Azure portal setting
  },
  cache: {
    cacheLocation: "sessionStorage", // or 'sessionStorage'
    storeAuthStateInCookie: false,
  },
};

export const protectedResources = {
  apiList: {
    endpoint: "http://localhost:3001",
    scopes: {
      read: ["https://orcimedlifesciences.sharepoint.com"],
      write: ["https://orcimedlifesciences.sharepoint.com"],
    },
  },
};


export const loginRequest = {
  scopes: [
    "User.Read",
    // "Sites.Read.All",
    // "User.ReadBasic.All",
  ],
};