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
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  MapPin,
} from "lucide-react";

const Complainant = () => {
  const [activeTab, setActiveTab] = useState("report");
  const [formData, setFormData] = useState({
    reportType: "",
    title: "",
    description: "",
    location: "",
    dateTime: "",
    complainantName: "",
    contactNumber: "",
    email: "",
    isAnonymous: false,
    urgencyLevel: "",
    witnesses: "",
    additionalInfo: "",
  });

  const reportTypes = [
    "Noise Complaint",
    "Traffic Accident",
    "Theft/Robbery",
    "Public Disturbance",
    "Property Damage",
    "Environmental Issue",
    "Animal-related Issue",
    "Infrastructure Problem",
    "Violence/Assault",
    "Other",
  ];

  const urgencyLevels = [
    { value: "low", label: "Low Priority", color: "text-green-600" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-600" },
    { value: "high", label: "High Priority", color: "text-orange-600" },
    { value: "emergency", label: "Emergency", color: "text-red-600" },
  ];

  const mockReports = [
    {
      id: 1,
      title: "Noise Complaint - Loud Music",
      reportType: "Noise Complaint",
      status: "pending",
      dateReported: "2024-01-15",
      urgencyLevel: "medium",
      location: "Purok 1, Main Street",
    },
    {
      id: 2,
      title: "Traffic Accident - Minor Collision",
      reportType: "Traffic Accident",
      status: "under_investigation",
      dateReported: "2024-01-12",
      urgencyLevel: "high",
      location: "Corner of Rizal and Bonifacio St.",
    },
    {
      id: 3,
      title: "Pothole on Main Road",
      reportType: "Infrastructure Problem",
      status: "resolved",
      dateReported: "2024-01-08",
      urgencyLevel: "low",
      location: "Main Road, near Elementary School",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Report submitted:", formData);
    // Reset form
    setFormData({
      reportType: "",
      title: "",
      description: "",
      location: "",
      dateTime: "",
      complainantName: "",
      contactNumber: "",
      email: "",
      isAnonymous: false,
      urgencyLevel: "",
      witnesses: "",
      additionalInfo: "",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "under_investigation":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "under_investigation":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const getUrgencyColor = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "emergency":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Incident Report & Complaints
          </h1>
          <p className="text-gray-600">
            Report incidents, accidents, or file complaints to the barangay
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("report")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "report"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          File Report
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Reports
        </button>
      </div>

      {/* File Report Tab */}
      {activeTab === "report" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Report Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Type of Report *</Label>
                  <Select
                    value={formData.reportType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, reportType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                  <Select
                    value={formData.urgencyLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, urgencyLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={level.color}>{level.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the incident"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Where did this happen?"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTime">Date & Time *</Label>
                  <Input
                    id="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) =>
                      setFormData({ ...formData, dateTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide a detailed description of what happened..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="witnesses">Witnesses (if any)</Label>
                <Textarea
                  id="witnesses"
                  placeholder="List any witnesses with their contact information..."
                  value={formData.witnesses}
                  onChange={(e) =>
                    setFormData({ ...formData, witnesses: e.target.value })
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Complainant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Complainant Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, isAnonymous: e.target.checked })
                  }
                />
                <Label htmlFor="anonymous">Submit anonymously</Label>
              </div>
              {!formData.isAnonymous && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="complainantName">Full Name *</Label>
                    <Input
                      id="complainantName"
                      placeholder="Enter your full name"
                      value={formData.complainantName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          complainantName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      placeholder="09123456789"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Notes</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional information that might be helpful..."
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalInfo: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Submit Report
          </Button>
        </form>
      )}

      {/* Report History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {mockReports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reports found
                </h3>
                <p className="text-gray-500 text-center">
                  You haven't submitted any reports yet
                </p>
              </CardContent>
            </Card>
          ) : (
            mockReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          <span className="ml-1 capitalize">
                            {report.status.replace("_", " ")}
                          </span>
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Type: {report.reportType}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>Location: {report.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Reported: {report.dateReported}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                          report.urgencyLevel
                        )}`}
                      >
                        {report.urgencyLevel === "emergency"
                          ? "Emergency"
                          : `${report.urgencyLevel} Priority`}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: #{report.id.toString().padStart(4, "0")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Complainant;
