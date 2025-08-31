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
import { Plus, Clock, CheckCircle, XCircle, User } from "lucide-react";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [formData, setFormData] = useState({
    documentType: "",
    purpose: "",
    quantity: 1,
    notes: "",
    fullName: "",
    address: "",
    contactNumber: "",
  });

  const documentTypes = [
    "Barangay Clearance",
    "Certificate of Residency",
    "Certificate of Indigency",
    "Business Permit",
    "Community Tax Certificate",
    "Certificate of Good Moral Character",
    "Certificate of Non-Issuance of Building Permit",
  ];

  const mockRequests = [
    {
      id: 1,
      documentType: "Barangay Clearance",
      purpose: "Employment Requirements",
      status: "pending",
      dateRequested: "2024-01-15",
      quantity: 1,
      fullName: "Juan Dela Cruz",
      contactNumber: "09123456789",
    },
    {
      id: 2,
      documentType: "Certificate of Residency",
      purpose: "School Requirements",
      status: "ready",
      dateRequested: "2024-01-10",
      quantity: 2,
      fullName: "Maria Santos",
      contactNumber: "09987654321",
    },
    {
      id: 3,
      documentType: "Certificate of Indigency",
      purpose: "Medical Assistance",
      status: "completed",
      dateRequested: "2024-01-05",
      quantity: 1,
      fullName: "Pedro Garcia",
      contactNumber: "09555666777",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Document request submitted:", formData);
    // Reset form
    setFormData({
      documentType: "",
      purpose: "",
      quantity: 1,
      notes: "",
      fullName: "",
      address: "",
      contactNumber: "",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "ready":
        return "text-green-600 bg-green-50 border-green-200";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Requests
          </h1>
          <p className="text-gray-600">
            Request barangay documents and track your applications
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("request")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "request"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          New Request
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Request History
        </button>
      </div>

      {/* New Request Tab */}
      {activeTab === "request" && (
        <div className="space-y-6">
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    placeholder="09XXXXXXXXX"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Input
                    id="address"
                    placeholder="House No., Street, Purok/Sitio, Barangay"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Request Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Document Request Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type *</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, documentType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Input
                    id="purpose"
                    placeholder="e.g., Employment, School Requirements, Government Transaction"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or special requests"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    !formData.documentType ||
                    !formData.purpose ||
                    !formData.fullName ||
                    !formData.address ||
                    !formData.contactNumber
                  }
                >
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Request History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <div>
                          <h4 className="font-medium">
                            {request.documentType}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {request.purpose} • Qty: {request.quantity}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requestor: {request.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Contact: {request.contactNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requested:{" "}
                            {new Date(
                              request.dateRequested
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                      {request.status === "ready" && (
                        <Button size="sm" variant="outline">
                          Claim
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>Processing time: 3-5 business days for most documents</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>Bring valid ID when claiming documents</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>Office hours: Monday-Friday, 8:00 AM - 5:00 PM</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>For urgent requests, visit the barangay office directly</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p>All fields marked with (*) are required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Documents;
