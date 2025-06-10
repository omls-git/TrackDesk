const GRAPH_API_URL = 'https://graph.microsoft.com/v1.0';

export async function getADUsers(query) {
    try {
        const token = await getAccessToken(); // Replace with your method to get the access token
        const response = await fetch(`${GRAPH_API_URL}/users?$filter=startswith(displayName, '${query}') or startswith(mail, '${query}')&$select=id,displayName,mail`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Error fetching AD users:', error);
        throw error;
    }
}
// Mock function to get access token, replace with your actual implementation
async function getAccessToken() {
    // Implement your logic to retrieve the access token
    return 'YOUR_ACCESS_TOKEN';
}