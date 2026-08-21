export class ApiException extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch {
    throw new ApiException(
      `Unable to connect to the server. Make sure the Spring Boot backend is running on ${BASE_URL}.`,
      0
    );
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let status = response.status;
    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody === 'object' && errorBody.message) {
        errorMessage = errorBody.message;
      }
      if (errorBody && typeof errorBody === 'object' && typeof errorBody.status === 'number') {
        status = errorBody.status;
      }
    } catch {
      // Body wasn't JSON, use default error message
    }
    throw new ApiException(errorMessage, status);
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  return await response.json();
}
