// services/graphApi.js
import axios from 'axios';
import { msalInstance } from '../index'; // make sure this points to your MSAL instance
import { loginRequest } from '../authConfig';

export const getUsers = async () => {
  try {
    const account = msalInstance.getAllAccounts()[0];
    const response = await msalInstance.acquireTokenSilent({
      scopes: loginRequest.scopes,
      account: account
    });

    const accessToken = response.accessToken;

    const graphResponse = await axios.get('https://graph.microsoft.com/v1.0/users?$select=displayName,mail,id', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Handle paging to get all users
    let users = graphResponse.data.value;
    let nextLink = graphResponse.data['@odata.nextLink'];

    while (nextLink) {
      const nextResponse = await axios.get(nextLink, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
      });
      users = users.concat(nextResponse.data.value);
      nextLink = nextResponse.data['@odata.nextLink'];
    }

    return users;

  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
