import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Save,
  Camera,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "09123456789",
    address: "123 Main Street, Barangay Sample",
    birthDate: "1990-01-15",
    civilStatus: "Single",
    occupation: "Teacher",
    emergencyContact: "09987654321",
    emergencyContactName: "Maria Dela Cruz",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    announcementAlerts: true,
    documentUpdates: true,
    eventReminders: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showAddress: false,
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
  };

  const handleNotificationUpdate = () => {
    console.log("Notification settings updated:", notificationSettings);
  };

  const handlePrivacyUpdate = () => {
    console.log("Privacy settings updated:", privacySettings);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and privacy settings
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "notifications"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "privacy"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Privacy
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Profile Picture</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="phone"
                        className="pl-10"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      className="pl-10"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          birthDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus">Civil Status</Label>
                    <Select
                      value={profileData.civilStatus}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, civilStatus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profileData.occupation}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        occupation: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">
                      Emergency Contact Name
                    </Label>
                    <Input
                      id="emergencyContactName"
                      value={profileData.emergencyContactName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyContactName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">
                      Emergency Contact Number
                    </Label>
                    <Input
                      id="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyContact: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                id="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    smsNotifications: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="announcementAlerts">Announcement Alerts</Label>
                <p className="text-sm text-gray-500">
                  Get notified about new barangay announcements
                </p>
              </div>
              <Switch
                id="announcementAlerts"
                checked={notificationSettings.announcementAlerts}
                onCheckedChange={(checked) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    announcementAlerts: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="documentUpdates">Document Updates</Label>
                <p className="text-sm text-gray-500">
                  Get notified about document request status changes
                </p>
              </div>
              <Switch
                id="documentUpdates"
                checked={notificationSettings.documentUpdates}
                onCheckedChange={(checked) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    documentUpdates: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="eventReminders">Event Reminders</Label>
                <p className="text-sm text-gray-500">
                  Receive reminders about upcoming events
                </p>
              </div>
              <Switch
                id="eventReminders"
                checked={notificationSettings.eventReminders}
                onCheckedChange={(checked) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    eventReminders: checked,
                  })
                }
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleNotificationUpdate}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Preferences</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Privacy Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profileVisibility">Profile Visibility</Label>
              <Select
                value={privacySettings.profileVisibility}
                onValueChange={(value) =>
                  setPrivacySettings({
                    ...privacySettings,
                    profileVisibility: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="barangay">Barangay Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Control who can see your profile information
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showEmail">Show Email Address</Label>
                <p className="text-sm text-gray-500">
                  Allow others to see your email address
                </p>
              </div>
              <Switch
                id="showEmail"
                checked={privacySettings.showEmail}
                onCheckedChange={(checked) =>
                  setPrivacySettings({ ...privacySettings, showEmail: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showPhone">Show Phone Number</Label>
                <p className="text-sm text-gray-500">
                  Allow others to see your phone number
                </p>
              </div>
              <Switch
                id="showPhone"
                checked={privacySettings.showPhone}
                onCheckedChange={(checked) =>
                  setPrivacySettings({ ...privacySettings, showPhone: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showAddress">Show Address</Label>
                <p className="text-sm text-gray-500">
                  Allow others to see your address
                </p>
              </div>
              <Switch
                id="showAddress"
                checked={privacySettings.showAddress}
                onCheckedChange={(checked) =>
                  setPrivacySettings({
                    ...privacySettings,
                    showAddress: checked,
                  })
                }
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handlePrivacyUpdate}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
