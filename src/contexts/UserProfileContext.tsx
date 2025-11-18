import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { userService, type UserProfile } from "@/services/api/userService";
import { useAuth } from "./AuthContext";

interface UserProfileContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfileCache: (profile: UserProfile) => void;
  clearProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const currentUserIdRef = useRef<number | null>(null);

  // Get auth context to detect login/logout
  const { isAuthenticated, userInfo } = useAuth();

  const loadUserProfile = useCallback(async (forceRefresh = false) => {
    setLoading(true);

    try {
      // Get user info from localStorage
      const storedUserInfo = localStorage.getItem("user_info");

      if (!storedUserInfo) {
        console.error("No user_info found in localStorage");
        setUserProfile(null);
        currentUserIdRef.current = null;
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUserInfo);
      console.log("User info from localStorage:", user);

      if (!user || !user.id) {
        console.error("User object or user.id is missing");
        setUserProfile(null);
        currentUserIdRef.current = null;
        setLoading(false);
        return;
      }

      // Check if user has changed - if so, clear cache and force refresh
      if (
        currentUserIdRef.current !== null &&
        currentUserIdRef.current !== user.id
      ) {
        console.log("User changed - clearing cache and forcing refresh");
        localStorage.removeItem("user_profile_cache");
        forceRefresh = true;
      }

      currentUserIdRef.current = user.id;

      // Check if we have cached user profile (only if not forcing refresh)
      if (!forceRefresh) {
        const cachedProfile = localStorage.getItem("user_profile_cache");
        if (
          cachedProfile &&
          cachedProfile !== "undefined" &&
          cachedProfile !== "null"
        ) {
          try {
            const parsedCache = JSON.parse(cachedProfile);
            // Validate cache belongs to current user
            if (parsedCache && parsedCache.id === user.id) {
              console.log("Using cached profile:", parsedCache);
              setUserProfile(parsedCache);
              setLoading(false);
              return;
            } else {
              console.log("Cache mismatch - clearing and fetching fresh");
              localStorage.removeItem("user_profile_cache");
            }
          } catch (error) {
            console.error("Error parsing cached profile:", error);
            localStorage.removeItem("user_profile_cache");
          }
        }
      }

      // Check if we're using mock data (localStorage-based auth)
      const authToken = localStorage.getItem("auth_token");
      const isMockAuth = authToken && authToken.startsWith("mock_token_");

      if (isMockAuth) {
        // Use localStorage data for mock authentication
        console.log("Mock authentication detected - using localStorage data");

        // Get approved user data
        const approvedUsers = JSON.parse(
          localStorage.getItem("approvedUsers") || "[]"
        );
        const approvedUser = approvedUsers.find(
          (u: { id: string; email: string }) => u.id === user.id || u.email === user.email
        );

        if (approvedUser) {
          // Create profile from approved user data
          const mockProfile: UserProfile = {
            id: approvedUser.id || user.id,
            name: approvedUser.fullName || user.name,
            email: approvedUser.email || user.email,
            profile_url: approvedUser.profile_url || "",
          };
          console.log("Created mock profile:", mockProfile);
          setUserProfile(mockProfile);
          localStorage.setItem("user_profile_cache", JSON.stringify(mockProfile));
        } else {
          // Fallback to basic user info
          const fallbackProfile: UserProfile = {
            id: user.id || 0,
            name: user.name || "User",
            email: user.email || "user@email.com",
            profile_url: "",
          };
          console.log("Using fallback profile:", fallbackProfile);
          setUserProfile(fallbackProfile);
          localStorage.setItem(
            "user_profile_cache",
            JSON.stringify(fallbackProfile)
          );
        }
      } else {
        // Fetch from API using getUserProfileById (real backend)
        try {
          console.log("Fetching profile from API for user ID:", user.id);
          const response = await userService.getUserProfileById(user.id);
          console.log("API Response:", response);

          // Validate response structure
          if (!response || typeof response !== "object") {
            throw new Error("Invalid response structure");
          }

          // Check for successful response (200-299 status codes are success)
          const isSuccess =
            response.response_code >= 200 && response.response_code < 300;

          if (!isSuccess) {
            throw new Error(response.message || "Failed to fetch profile");
          }

          // Get profile data - API may return either 'data' or 'user_info'
          const profile = response.data || response.user_info;

          // Validate profile exists
          if (!profile) {
            console.error("Response missing profile data:", response);
            throw new Error("Profile data not found in response");
          }

          console.log("Profile data:", profile);

          // Validate profile data structure
          if (!profile.id) {
            console.error("Invalid profile structure:", profile);
            throw new Error("Invalid profile data - missing ID");
          }

          setUserProfile(profile);
          // Cache the profile
          localStorage.setItem("user_profile_cache", JSON.stringify(profile));
        } catch (error) {
          console.error("Error fetching user profile from API:", error);

          // Fallback to basic user info from localStorage
          const fallbackProfile: UserProfile = {
            id: user.id || 0,
            name: user.name || user.first_name || "User",
            email: user.email || "user@email.com",
            profile_url: user.profile_url || "",
          };
          console.log("Using fallback profile after API error:", fallbackProfile);
          setUserProfile(fallbackProfile);
          localStorage.setItem(
            "user_profile_cache",
            JSON.stringify(fallbackProfile)
          );
        }
      }
    } catch (error) {
      console.error("Error in loadUserProfile:", error);

      // Final fallback - always create a basic profile to prevent logout
      try {
        const storedUserInfo = localStorage.getItem("user_info");
        if (storedUserInfo) {
          const user = JSON.parse(storedUserInfo);
          const fallbackProfile: UserProfile = {
            id: user.id || 0,
            name: user.name || "User",
            email: user.email || "user@email.com",
            profile_url: "",
          };
          console.log("Using emergency fallback profile:", fallbackProfile);
          setUserProfile(fallbackProfile);
          localStorage.setItem(
            "user_profile_cache",
            JSON.stringify(fallbackProfile)
          );
        }
      } catch (fallbackError) {
        console.error("Error creating fallback profile:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load profile when user authenticates or user changes
  useEffect(() => {
    if (isAuthenticated && userInfo?.id) {
      console.log(
        "Auth state changed - loading profile for user:",
        userInfo.id
      );
      // Check if this is a different user
      if (currentUserIdRef.current !== userInfo.id) {
        console.log("Different user detected - forcing refresh");
        loadUserProfile(true); // Force refresh for new user
      } else {
        loadUserProfile(false); // Use cache for same user
      }
    } else {
      // User is not authenticated, clear profile
      console.log("User not authenticated - clearing profile");
      setUserProfile(null);
      currentUserIdRef.current = null;
    }
  }, [isAuthenticated, userInfo, loadUserProfile]);

  // Method to refresh profile (call this after updates)
  const refreshProfile = useCallback(async () => {
    // Clear cache to force fresh fetch
    localStorage.removeItem("user_profile_cache");
    await loadUserProfile(true);
  }, [loadUserProfile]);

  // Method to update profile cache directly (for optimistic updates)
  const updateProfileCache = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem("user_profile_cache", JSON.stringify(profile));
  }, []);

  // Method to clear profile (call on logout)
  const clearProfile = useCallback(() => {
    console.log("Clearing profile");
    setUserProfile(null);
    currentUserIdRef.current = null;
    localStorage.removeItem("user_profile_cache");
  }, []);

  const value: UserProfileContextType = {
    userProfile,
    loading,
    refreshProfile,
    updateProfileCache,
    clearProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};

export default UserProfileContext;
