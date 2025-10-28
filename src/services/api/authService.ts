import apiClient from './config';

// Types for authentication requests and responses
export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  // Resident fields
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  birthDate?: string;
  gender?: string;
  placeOfBirth?: string;
  civilStatus?: string;
  houseNumber?: string;
  street?: string;
  zone?: string;
  city?: string;
  province?: string;
  contactNumber?: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  fatherFirstName?: string;
  fatherMiddleName?: string;
  fatherLastName?: string;
  motherFirstName?: string;
  motherMiddleName?: string;
  motherMaidenName?: string;
  validId?: File;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminRegisterRequest {
  name: string;
  username: string;
  password: string;
  role: string;
}

export interface UserLoginResponse {
  response_code: number;
  status: string;
  message: string;
  user_info: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
  token_type: string;
}

export interface AdminLoginResponse {
  id: number;
  name: string;
  username: string;
  role: string;
  token: string;
  token_type: string;
  message: string;
}

export interface UserRegisterResponse {
  response_code: number;
  status: string;
  message: string;
  data_user_list: {
    id: number;
    name: string;
    email: string;
  };
  resident?: unknown;
}

// Authentication Service
export const authService = {
  // User Authentication
  userLogin: async (credentials: UserLoginRequest): Promise<UserLoginResponse> => {
    const response = await apiClient.post<UserLoginResponse>('/login', credentials);

    // Store token and user info
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_info', JSON.stringify(response.data.user_info));
      localStorage.setItem('user_type', 'user');
    }

    return response.data;
  },

  userRegister: async (userData: UserRegisterRequest): Promise<UserRegisterResponse> => {
    // Handle file upload for validId
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'validId' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post<UserRegisterResponse>('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  userLogout: async (): Promise<void> => {
    try {
      await apiClient.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('user_type');
    }
  },

  // Admin Authentication
  adminLogin: async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await apiClient.post<AdminLoginResponse>('/admin-login', credentials);

    // Store token and admin info
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('admin_info', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        username: response.data.username,
        role: response.data.role,
      }));
      localStorage.setItem('user_type', 'admin');
    }

    return response.data;
  },

  adminRegister: async (adminData: AdminRegisterRequest): Promise<AdminLoginResponse> => {
    const response = await apiClient.post<AdminLoginResponse>('/admin-register', adminData);
    return response.data;
  },

  adminLogout: async (): Promise<void> => {
    try {
      await apiClient.post('/admin-logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_info');
      localStorage.removeItem('user_type');
    }
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    const response = await apiClient.get('/get-user');
    return response.data;
  },

  // Update password
  updatePassword: async (userId: number, passwordData: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await apiClient.put(`/update-password/${userId}`, passwordData);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  // Get user type
  getUserType: (): 'user' | 'admin' | null => {
    return localStorage.getItem('user_type') as 'user' | 'admin' | null;
  },

  // Get stored user info
  getStoredUserInfo: () => {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Get stored admin info
  getStoredAdminInfo: () => {
    const adminInfo = localStorage.getItem('admin_info');
    return adminInfo ? JSON.parse(adminInfo) : null;
  },
};

export default authService;