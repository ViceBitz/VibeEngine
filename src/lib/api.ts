const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token from localStorage
function getToken(): string | null {
  return localStorage.getItem('authToken');
}

// Helper function to make API requests
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: async (email: string, password: string) => {
    return request<{ token: string; user: { id: string; email: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return request<{ token: string; user: { id: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getCurrentUser: async () => {
    return request<{ id: string; email: string; githubConnected: boolean }>('/auth/me');
  },
};

// GitHub API
export const githubApi = {
  getOAuthUrl: async () => {
    return request<{ authUrl: string; state: string }>('/github/oauth/url');
  },

  handleCallback: async (code: string, userId: string) => {
    return request<{ success: boolean; username: string; message: string }>('/github/oauth/callback', {
      method: 'POST',
      body: JSON.stringify({ code, userId }),
    });
  },

  getStatus: async () => {
    return request<{ connected: boolean }>('/github/status');
  },

  getRepos: async () => {
    return request<
      Array<{
        id: number;
        full_name: string;
        private: boolean;
        description: string;
        language: string;
        updated_at: string;
      }>
    >('/github/repos');
  },

  getRepoFiles: async (owner: string, repo: string) => {
    return request<{ files: Array<{ path: string; name: string; sha: string; size: number }>; count: number }>(
      `/github/repos/${owner}/${repo}/files`
    );
  },

  getFileContent: async (owner: string, repo: string, path: string, ref: string = 'main') => {
    return request<{ name: string; path: string; content: string; sha: string }>(
      `/github/repos/${owner}/${repo}/content?path=${encodeURIComponent(path)}&ref=${encodeURIComponent(ref)}`
    );
  },

  connectRepo: async (full_name: string) => {
    return request<{ success: boolean; projectId: string; message: string }>('/github/repos/connect', {
      method: 'POST',
      body: JSON.stringify({ full_name }),
    });
  },

  createWebhook: async (owner: string, repo: string) => {
    return request<{ success: boolean; message: string }>('/github/webhook', {
      method: 'POST',
      body: JSON.stringify({ owner, repo }),
    });
  },
};

// Gemini API
export const geminiApi = {
  generate: async (promptType: number, input: string, context?: any) => {
    return request<any>('/gemini/generate', {
      method: 'POST',
      body: JSON.stringify({ promptType, input, context }),
    });
  },
};

// Projects API
export const projectsApi = {
  list: async () => {
    return request<any[]>('/projects');
  },

  get: async (projectId: string) => {
    return request<any>(`/projects/${projectId}`);
  },

  getFeatures: async (projectId: string) => {
    return request<any[]>(`/projects/${projectId}/features`);
  },

  createFeatures: async (projectId: string, features: any[], relationships?: any[]) => {
    return request<{ success: boolean; features: any[]; count: number }>(`/projects/${projectId}/features`, {
      method: 'POST',
      body: JSON.stringify({ features, relationships }),
    });
  },

  updateFeature: async (projectId: string, featureId: string, updates: any) => {
    return request<any>(`/projects/${projectId}/features/${featureId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Workflows API
export const workflowsApi = {
  startOnboarding: async (input: string) => {
    const data = JSON.parse(input);
    return request<{ success: boolean; executionArn: string; message: string }>('/workflows/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  startModification: async (input: string) => {
    const data = JSON.parse(input);
    return request<{ success: boolean; executionArn: string; output: any }>('/workflows/modification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getStatus: async (executionArn: string) => {
    return request<{ status: string; executionArn: string; output?: any }>(`/workflows/status/${executionArn}`);
  },
};

