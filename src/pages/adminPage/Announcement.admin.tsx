import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  Megaphone,
  Bell,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import eventService, { type Event } from "@/services/api/eventService";
import GeneralLoading from "@/components/GeneralLoading";

// Zod schema for form validation
const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

const Announcement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Event | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
    },
  });

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAll();
      setAnnouncements(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch announcements";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: AnnouncementFormValues) => {
    try {
      setIsSubmitting(true);

      if (editingAnnouncement) {
        // Update existing announcement
        await eventService.update(editingAnnouncement.id!, values);
        toast.success("Announcement updated successfully");
      } else {
        // Create new announcement
        await eventService.create(values);
        toast.success("Announcement created successfully");
      }

      setIsDialogOpen(false);
      form.reset();
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save announcement";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement: Event) => {
    setEditingAnnouncement(announcement);
    form.reset({
      title: announcement.title,
      description: announcement.description,
      date: announcement.date,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsSubmitting(true);
      await eventService.delete(deletingId);
      toast.success("Announcement deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      fetchAnnouncements();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete announcement";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (id: number) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingAnnouncement(null);
    form.reset({
      title: "",
      description: "",
      date: "",
    });
    setIsDialogOpen(true);
  };

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <GeneralLoading loading={loading} message="Loading" />;
  }

  return (
    <div className="space-y-6 p-6">
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
        <Button className="w-fit" onClick={handleAddNew}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Filtered Results
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAnnouncements.length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Announcements */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-gray-500" />
          All Announcements
        </h2>
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">
                      {announcement.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(announcement.date)}
                      </div>
                      {announcement.posted_by && (
                        <Badge variant="default">
                          By {announcement.posted_by}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(announcement.id!)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {announcement.description}
                </p>
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

      {/* Add/Edit Announcement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement
                ? "Edit Announcement"
                : "Create New Announcement"}
            </DialogTitle>
            <DialogDescription>
              {editingAnnouncement
                ? "Update the announcement details below."
                : "Fill in the details to create a new announcement."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter announcement title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter announcement description"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                    setEditingAnnouncement(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingAnnouncement ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingAnnouncement ? "Update" : "Create"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingId(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Announcement;
