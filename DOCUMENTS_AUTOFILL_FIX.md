# Documents.tsx Auto-Fill Fix

## Location
File: src/pages/userSide/pages/Documents.tsx
Lines: 81-91

## Current Code (Lines 81-91):
```typescript
  // Auto-fill user information on mount
  useEffect(() => {
    const userInfo = authService.getStoredUserInfo();
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        fullName: "",
        email: "",
      }));
    }
  }, []);
```

## Replace With:
```typescript
  // Auto-fill user information from resident data on mount
  useEffect(() => {
    const fetchResidentData = async () => {
      try {
        const userInfo = authService.getStoredUserInfo();
        if (!userInfo?.id) {
          return;
        }

        // Fetch resident data by user ID
        const response = await fetch(
          `http://localhost:8000/api/residents/by-user/${userInfo.id}`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
              "Accept": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const resident = result.data;

          // Build full name
          const fullName = [
            resident.first_name,
            resident.middle_name,
            resident.last_name,
            resident.suffix,
          ]
            .filter(Boolean)
            .join(" ");

          // Build complete address
          const address = [
            resident.house_number,
            resident.street,
            resident.zone,
            resident.city,
            resident.province,
          ]
            .filter(Boolean)
            .join(", ");

          // Auto-fill form with resident data
          setFormData((prev) => ({
            ...prev,
            fullName: fullName || userInfo.name || "",
            email: resident.email || userInfo.email || "",
            contactNumber: resident.contact_number || "",
            address: address || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching resident data:", error);
        // Fallback to basic user info
        const userInfo = authService.getStoredUserInfo();
        if (userInfo) {
          setFormData((prev) => ({
            ...prev,
            fullName: userInfo.name || "",
            email: userInfo.email || "",
          }));
        }
      }
    };

    fetchResidentData();
  }, []);
```

## What This Does:
1. Fetches full resident details from API endpoint `/residents/by-user/{userId}`
2. Auto-fills ALL form fields:
   - Full Name (first + middle + last + suffix)
   - Email Address
   - Contact Number  
   - Complete Address (house number + street + zone + city + province)
3. Falls back to basic user info if API call fails
4. Makes the form ready to use immediately without manual typing

## Optional: Make Fields Read-Only

If you want to prevent users from editing their personal info, add `readOnly` prop:

```typescript
<Input
  id="fullName"
  placeholder="Enter your full name"
  value={formData.fullName}
  onChange={(e) =>
    setFormData({ ...formData, fullName: e.target.value })
  }
  readOnly  // Add this
  className="bg-gray-50"  // Add this for visual feedback
  required
/>
```

Apply the same to: email, contactNumber, and address fields.
