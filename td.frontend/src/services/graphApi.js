// services/graphApi.js
import axios from 'axios';
import { msalInstance } from '../index'; // make sure this points to your MSAL instance
import { loginRequest } from '../authConfig';

export const getAccessToken = async() =>{
  try{
    const account = msalInstance.getAllAccounts()[0];
    const response = await msalInstance.acquireTokenSilent({
      scopes: loginRequest.scopes,
      account: account
    });
    const accessToken = response.accessToken;
    return accessToken
  }catch(error){
    console.error('Error acquiring access token:', error);
    return null;
  }
}

export const getUsers = async () => {
  try {
    const accessToken = await getAccessToken();
    if(!accessToken){
      alert('No access token available. Please login first.')
      return;
    }
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

export const getUserMails = async(sinceDateTime) => {  
  // const url = 'https://graph.microsoft.com/v1.0/me/messages';
  // https://graph.microsoft.com/v1.0/me/messages?$filter=receivedDateTime ge 2025-09-07T14:23:00Z&$orderby=receivedDateTime desc&$top=100
  let url = `https://graph.microsoft.com/v1.0/me/messages?$filter=receivedDateTime ge ${sinceDateTime}&$orderby=receivedDateTime desc&$top=50`;
  let allMails = [];
  const accessToken = await getAccessToken();
  if(!accessToken){
    alert('No access token available. Please login first.')
    return;
  }

  while(url){
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    allMails = allMails.concat(response.data.value);
    url = response.data['@odata.nextLink'];
  }
  console.log("allMails",allMails);
  const mails = allMails?.filter(mail => 
    (mail.ccRecipients && mail.ccRecipients[0]?.emailAddress?.address === 'DL-OMLS-Cipla_Non-XML_Book-in@orcimedlifesciences.com') ||
    (mail.toRecipients && mail.toRecipients[0]?.emailAddress?.address === 'DL-OMLS-Cipla_Non-XML_Book-in@orcimedlifesciences.com'));
  console.log(mails);
  return mails;
};