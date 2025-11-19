import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Megaphone, Search } from "lucide-react";
import { eventService } from "@/services/api/eventService";
import type { Event } from "@/services/api/eventService";
import { useToast } from "@/hooks/use-toast";
import GeneralLoading from "@/components/GeneralLoading";

const Announcement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [announcements, setAnnouncements] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventService.getAll();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast({
        title: "Error",
        description: "Failed to load announcements. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white h-10"
        />
      </div>

      {/* Announcements List */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
              <GeneralLoading
                loading={loading}
                message=" Loading announcements..."
              />
            </CardContent>
          </Card>
        ) : filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
              <Megaphone className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 text-center">
                No announcements found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 text-center max-w-md">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "There are no announcements at the moment"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className="transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <div className="space-y-2">
                  <CardTitle className="text-base sm:text-lg leading-tight">
                    {announcement.title}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{formatDate(announcement.date)}</span>
                    </span>
                    {/* <Badge variant="default">
                      By {announcement.posted_by || "Admin"}
                    </Badge> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pt-0">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {announcement.description}
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
