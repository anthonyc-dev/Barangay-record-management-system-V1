import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  Megaphone,
  Bell,
  Eye,
  Pin,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

const Announcement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements] = useState([
    {
      id: 1,
      title: "Barangay Assembly Meeting",
      content:
        "Monthly community meeting will be held on January 15, 2024 at 2:00 PM at the Barangay Hall. All residents are encouraged to attend. Agenda includes budget presentation and community projects discussion.",
      category: "Meeting",
      priority: "High",
      status: "Active",
      datePosted: "2024-01-10",
      author: "Barangay Captain",
      isPinned: true,
      views: 245,
    },
    {
      id: 2,
      title: "Clean-Up Drive - Linis Barangay Program",
      content:
        "Join us for our monthly clean-up drive this Saturday, January 20, 2024 from 6:00 AM - 10:00 AM. Meeting point: Barangay Basketball Court. Bring your own cleaning materials. Snacks will be provided.",
      category: "Event",
      priority: "Medium",
      status: "Active",
      datePosted: "2024-01-08",
      author: "SK Chairperson",
      isPinned: false,
      views: 189,
    },
    {
      id: 3,
      title: "Free Medical Check-Up and Vaccination",
      content:
        "Department of Health in partnership with our Barangay will conduct free medical check-up and vaccination on January 25, 2024 from 8:00 AM - 4:00 PM at the Barangay Health Center. Please bring your health records.",
      category: "Health",
      priority: "High",
      status: "Active",
      datePosted: "2024-01-05",
      author: "Barangay Health Worker",
      isPinned: true,
      views: 312,
    },
    {
      id: 4,
      title: "Water Interruption Notice",
      content:
        "Water supply will be temporarily interrupted on January 18, 2024 from 9:00 AM - 3:00 PM for pipeline maintenance in Purok 1-3. Please store enough water for your daily needs.",
      category: "Notice",
      priority: "Medium",
      status: "Active",
      datePosted: "2024-01-07",
      author: "Barangay Secretary",
      isPinned: false,
      views: 156,
    },
    {
      id: 5,
      title: "New Year Community Celebration - THANK YOU",
      content:
        "Thank you to all residents who participated in our New Year community celebration. Special thanks to volunteers and sponsors who made the event successful. See you in our next community activities!",
      category: "Event",
      priority: "Low",
      status: "Archived",
      datePosted: "2024-01-02",
      author: "Events Committee",
      isPinned: false,
      views: 98,
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Archived":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Meeting":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Event":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Health":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Notice":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.isPinned);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Barangay Announcements
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and publish announcements for the community
          </p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Announcements
                </p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
              <Megaphone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {announcements.filter((a) => a.status === "Active").length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pinned
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {announcements.filter((a) => a.isPinned).length}
                </p>
              </div>
              <Pin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {announcements.reduce((sum, a) => sum + a.views, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Pin className="mr-2 h-5 w-5 text-blue-500" />
            Pinned Announcements
          </h2>
          <div className="space-y-4">
            {pinnedAnnouncements.map((announcement) => (
              <Card
                key={announcement.id}
                className="border-l-4 border-l-blue-500"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">
                        {announcement.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={getPriorityColor(announcement.priority)}
                        >
                          {announcement.priority}
                        </Badge>
                        <Badge
                          className={getCategoryColor(announcement.category)}
                        >
                          {announcement.category}
                        </Badge>
                        <Badge className={getStatusColor(announcement.status)}>
                          {announcement.status}
                        </Badge>
                        {announcement.isPinned && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            <Pin className="mr-1 h-3 w-3" />
                            Pinned
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>By {announcement.author}</span>
                      <span>Posted: {announcement.datePosted}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>{announcement.views} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
          All Announcements
        </h2>
        <div className="space-y-4">
          {regularAnnouncements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">
                      {announcement.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={getPriorityColor(announcement.priority)}
                      >
                        {announcement.priority}
                      </Badge>
                      <Badge
                        className={getCategoryColor(announcement.category)}
                      >
                        {announcement.category}
                      </Badge>
                      <Badge className={getStatusColor(announcement.status)}>
                        {announcement.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>By {announcement.author}</span>
                    <span>Posted: {announcement.datePosted}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>{announcement.views} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredAnnouncements.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Megaphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No announcements found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first announcement to get started"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Announcement;
