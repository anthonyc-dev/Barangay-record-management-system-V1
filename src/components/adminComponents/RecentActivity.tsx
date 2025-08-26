import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, User, DollarSign } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "document",
    icon: FileText,
    title: "Barangay Clearance issued",
    description: "Juan Dela Cruz - Certificate #BC2024001",
    time: "2 minutes ago",
    status: "completed",
  },
  {
    id: 2,
    type: "resident",
    icon: User,
    title: "New resident registered",
    description: "Maria Santos - Household #HS2024102",
    time: "15 minutes ago",
    status: "new",
  },
  {
    id: 3,
    type: "payment",
    icon: DollarSign,
    title: "Payment received",
    description: "Document fee - ₱50.00",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 4,
    type: "document",
    icon: FileText,
    title: "Certificate of Indigency",
    description: "Ana Rodriguez - Certificate #CI2024012",
    time: "2 hours ago",
    status: "completed",
  },
];

const statusColors = {
  completed: "bg-green-500 text-white",
  new: "bg-blue-600 text-white",
  pending: "bg-yellow-400 text-black",
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <Badge
                    variant="secondary"
                    className={
                      statusColors[activity.status as keyof typeof statusColors]
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
