// Types for user details
export interface UserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  valid_id_path: string;
  valid_id_url: string;
  name: string;
  profile_url: string;
  // Add other fields as needed
}

export interface UserDetailsResponse {
  response_code: number;
  status: string;
  message: string;
  data: UserDetails;
}

// User Service
export const userService = {
  // Get user details by ID using direct fetch
  getUserDetailsById: async (userId: number): Promise<UserDetailsResponse> => {
    const response = await fetch(
      `http://localhost:8000/api/residents/by-user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  },

  // Get current user details (from stored user info)
  getCurrentUserDetails: async (): Promise<UserDetailsResponse> => {
    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) {
      throw new Error("No user info found");
    }

    const user = JSON.parse(userInfo);
    return userService.getUserDetailsById(user.id);
  },
};

export default userService;
