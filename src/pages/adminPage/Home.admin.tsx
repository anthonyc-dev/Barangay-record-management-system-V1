import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  DollarSign,
  Home,
  TrendingUp,
  Calendar,
  BarChart3,
  Megaphone,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatsCard } from "@/components/adminComponents/StatsCarrd";
import { RecentActivity } from "@/components/adminComponents/RecentActivity";

const HomePage = () => {
  return (
    <div>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening in your barangay today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Residents"
            value="2,847"
            icon={Users}
            description="Active registered residents"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Documents Issued"
            value="156"
            icon={FileText}
            description="This month"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Revenue"
            value="₱78,450"
            icon={DollarSign}
            description="Monthly collection"
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Households"
            value="842"
            icon={Home}
            description="Registered households"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Link to="/residents/add">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                  >
                    <Users className="h-5 w-5 text-primary mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Register New Resident</p>
                      <p className="text-sm text-muted-foreground">
                        Add a new resident to the system
                      </p>
                    </div>
                  </Button>
                </Link>

                <Link to="/documents">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                  >
                    <FileText className="h-5 w-5 text-primary mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Issue Document</p>
                      <p className="text-sm text-muted-foreground">
                        Generate certificates and clearances
                      </p>
                    </div>
                  </Button>
                </Link>

                <Link to="/reports">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                  >
                    <TrendingUp className="h-5 w-5 text-primary mr-3" />
                    <div className="text-left">
                      <p className="font-medium">View Reports</p>
                      <p className="text-sm text-muted-foreground">
                        Access analytics and insights
                      </p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Modules */}
        <Card>
          <CardHeader>
            <CardTitle>System Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/financial">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col bg-blue-50 hover:bg-blue-100"
                >
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Financial</span>
                  <span className="text-xs text-muted-foreground">
                    Budget & expenses
                  </span>
                </Button>
              </Link>

              <Link to="/reports">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col bg-blue-50 hover:bg-blue-100"
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Reports</span>
                  <span className="text-xs text-muted-foreground">
                    Analytics & data
                  </span>
                </Button>
              </Link>

              <Link to="/announcements">
                <Button
                  variant="secondary"
                  className="h-20 w-full flex-col bg-blue-50 hover:bg-blue-100"
                >
                  <Megaphone className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Announcements</span>
                  <span className="text-xs text-muted-foreground">
                    Public notices
                  </span>
                </Button>
              </Link>

              <Link to="/inventory">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col bg-blue-50 hover:bg-blue-100"
                >
                  <Package className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Inventory</span>
                  <span className="text-xs text-muted-foreground">
                    Assets & supplies
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Calendar and Updates */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 rounded-lg border border-border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    15
                  </div>
                  <div>
                    <p className="font-medium">Barangay Assembly</p>
                    <p className="text-sm text-muted-foreground">
                      Monthly community meeting
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-lg border border-border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white text-sm font-medium">
                    20
                  </div>
                  <div>
                    <p className="font-medium">Medical Mission</p>
                    <p className="text-sm text-muted-foreground">
                      Free health checkup for residents
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-500">Online</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-500">Updated</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Sync</span>
                  <span className="text-sm text-muted-foreground">
                    2 minutes ago
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
