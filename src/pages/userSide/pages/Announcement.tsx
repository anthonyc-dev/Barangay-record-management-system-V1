import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Megaphone, AlertCircle, Info, Search } from "lucide-react";

const Announcement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const mockAnnouncements = [
    {
      id: 1,
      title: "Community Clean-Up Drive",
      content:
        "Join us for our monthly community clean-up drive this Saturday, January 20, 2024, at 7:00 AM. Meeting point is at the Barangay Hall. Please bring gloves and face masks.",
      type: "event",
      priority: "high",
      datePosted: "2024-01-15",
      author: "Barangay Captain",
      isRead: false,
    },
    {
      id: 2,
      title: "Water Interruption Notice",
      content:
        "Please be advised that there will be a scheduled water interruption on January 18, 2024, from 8:00 AM to 5:00 PM due to pipe maintenance. We apologize for any inconvenience.",
      type: "notice",
      priority: "medium",
      datePosted: "2024-01-14",
      author: "Barangay Council",
      isRead: true,
    },
    {
      id: 3,
      title: "New Health Center Operating Hours",
      content:
        "Starting January 22, 2024, the Barangay Health Center will be open from 8:00 AM to 6:00 PM, Monday to Friday. Saturday hours are 8:00 AM to 12:00 PM.",
      type: "info",
      priority: "low",
      datePosted: "2024-01-12",
      author: "Health Officer",
      isRead: true,
    },
    {
      id: 4,
      title: "Basketball Tournament Registration",
      content:
        "Registration for the Inter-Purok Basketball Tournament is now open! Register your team at the Barangay Hall until January 25, 2024. Registration fee is PHP 500 per team.",
      type: "event",
      priority: "medium",
      datePosted: "2024-01-10",
      author: "Sports Committee",
      isRead: false,
    },
  ];

  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || announcement.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "notice":
        return <AlertCircle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-blue-100 text-blue-800";
      case "notice":
        return "bg-orange-100 text-orange-800";
      case "info":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 ">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Announcements
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Stay updated with the latest barangay news and events
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white h-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={filterType === "event" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("event")}
            className="whitespace-nowrap"
          >
            Events
          </Button>
          <Button
            variant={filterType === "notice" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("notice")}
            className="whitespace-nowrap"
          >
            Notices
          </Button>
          <Button
            variant={filterType === "info" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("info")}
            className="whitespace-nowrap"
          >
            Info
          </Button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
              <Megaphone className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 text-center">
                No announcements found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 text-center max-w-md">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "There are no announcements at the moment"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`transition-all hover:shadow-md ${
                !announcement.isRead
                  ? "border-l-2 sm:border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  {/* Icon and Title Section */}
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${getTypeColor(
                        announcement.type
                      )}`}
                    >
                      {getTypeIcon(announcement.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-2 mb-1">
                        <CardTitle className="text-base sm:text-lg flex-1 leading-tight">
                          {announcement.title}
                        </CardTitle>
                        {!announcement.isRead && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">
                            {formatDate(announcement.datePosted)}
                          </span>
                        </span>
                        <span className="truncate">
                          By {announcement.author}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-2">
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs ${getTypeColor(
                        announcement.type
                      )}`}
                    >
                      {announcement.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pt-0">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {announcement.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcement;
