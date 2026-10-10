const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');


export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle audio / blob responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('audio/')) {
      if (!response.ok) {
        throw new Error(`Audio request failed with status ${response.status}`);
      }
      return response.blob();
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export default { request };
