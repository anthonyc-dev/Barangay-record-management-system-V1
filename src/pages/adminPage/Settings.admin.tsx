import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Bell,
  Database,
  Palette,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    // Profile settings
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "admin@barangay.gov.ph",
    phone: "+63 912 345 6789",
    position: "Barangay Captain",

    // Security settings
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,

    // System settings
    emailNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    documentApprovalNotifications: true,

    // Appearance settings
    theme: "light",
    language: "English",
    timezone: "Asia/Manila",

    // Backup settings
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: "30",
  });

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "system", name: "System", icon: Database },
    { id: "appearance", name: "Appearance", icon: Palette },
  ];

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <Input
                  value={settings.firstName}
                  onChange={(e) =>
                    setSettings({ ...settings, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <Input
                  value={settings.lastName}
                  onChange={(e) =>
                    setSettings({ ...settings, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="flex items-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <Input
                value={settings.position}
                onChange={(e) =>
                  setSettings({ ...settings, position: e.target.value })
                }
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={settings.currentPassword}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={settings.newPassword}
                    onChange={(e) =>
                      setSettings({ ...settings, newPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Badge
                  variant={settings.twoFactorEnabled ? "default" : "secondary"}
                >
                  {settings.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Badge
                    variant={
                      settings.emailNotifications ? "default" : "secondary"
                    }
                  >
                    {settings.emailNotifications ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via SMS
                    </p>
                  </div>
                  <Badge
                    variant={
                      settings.smsNotifications ? "default" : "secondary"
                    }
                  >
                    {settings.smsNotifications ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Important system notifications
                    </p>
                  </div>
                  <Badge
                    variant={settings.systemAlerts ? "default" : "secondary"}
                  >
                    {settings.systemAlerts ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Document Approval Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      New document requests requiring approval
                    </p>
                  </div>
                  <Badge
                    variant={
                      settings.documentApprovalNotifications
                        ? "default"
                        : "secondary"
                    }
                  >
                    {settings.documentApprovalNotifications ? "On" : "Off"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Backup Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatic Backup</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup system data
                    </p>
                  </div>
                  <Badge
                    variant={settings.autoBackup ? "default" : "secondary"}
                  >
                    {settings.autoBackup ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Backup Frequency
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={settings.backupFrequency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        backupFrequency: e.target.value,
                      })
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Retention Period (days)
                  </label>
                  <Input
                    type="number"
                    value={settings.retentionPeriod}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        retentionPeriod: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">System Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    System Version
                  </span>
                  <span className="text-sm">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Database Status
                  </span>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Backup
                  </span>
                  <span className="text-sm">Today, 2:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                className="w-full p-2 border rounded-md"
                value={settings.theme}
                onChange={(e) =>
                  setSettings({ ...settings, theme: e.target.value })
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                className="w-full p-2 border rounded-md"
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
              >
                <option value="English">English</option>
                <option value="Filipino">Filipino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select
                className="w-full p-2 border rounded-md"
                value={settings.timezone}
                onChange={(e) =>
                  setSettings({ ...settings, timezone: e.target.value })
                }
              >
                <option value="Asia/Manila">Asia/Manila (UTC+8)</option>
                <option value="UTC">UTC (UTC+0)</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Admin Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and system preferences
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Settings Menu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {tabs.find((tab) => tab.id === activeTab)?.name} Settings
            </CardTitle>
          </CardHeader>
          <CardContent>{renderTabContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
