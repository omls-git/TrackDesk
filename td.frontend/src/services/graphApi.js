// services/graphApi.js
import axios from 'axios';
import { graphConfig } from '../authConfig';
import { msalInstance } from '../index'; // make sure this points to your MSAL instance

export const getUsers = async () => {
  try {
    const account = msalInstance.getAllAccounts()[0];
    const response = await msalInstance.acquireTokenSilent({
      scopes: graphConfig.graphUserScopes,
      account: account
    });

    const accessToken = response.accessToken;

    const graphResponse = await axios.get('https://graph.microsoft.com/v1.0/users?$select=displayName,mail,id', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return graphResponse.data.value;

  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
