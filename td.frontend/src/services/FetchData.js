import axios from 'axios';

const API_URL = 'https://your-api-domain.com/allcases';

export const fetchAllCases = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching all cases:', error);
    throw error;
  }
};