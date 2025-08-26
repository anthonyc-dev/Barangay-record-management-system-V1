import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  User,
  DollarSign,
  Eye,
  Printer,
} from "lucide-react";

const documents = [
  {
    id: "BC2024001",
    type: "Barangay Clearance",
    residentName: "Juan Dela Cruz",
    dateIssued: "2024-01-15",
    purpose: "Employment",
    fee: 50,
    status: "Issued",
    issuedBy: "Admin User",
  },
  {
    id: "CI2024012",
    type: "Certificate of Indigency",
    residentName: "Ana Rodriguez",
    dateIssued: "2024-01-14",
    purpose: "Medical Assistance",
    fee: 0,
    status: "Issued",
    issuedBy: "Staff User",
  },
  {
    id: "CR2024008",
    type: "Certificate of Residency",
    residentName: "Maria Santos",
    dateIssued: "2024-01-13",
    purpose: "School Registration",
    fee: 30,
    status: "Issued",
    issuedBy: "Admin User",
  },
  {
    id: "BP2024003",
    type: "Business Permit",
    residentName: "Pedro Rodriguez",
    dateIssued: "2024-01-12",
    purpose: "Sari-sari Store",
    fee: 100,
    status: "Pending",
    issuedBy: "Admin User",
  },
];

const documentTypes = [
  {
    name: "Barangay Clearance",
    description: "Certification for employment, travel, and other purposes",
    fee: "₱50.00",
    icon: FileText,
    color: "bg-primary",
  },
  {
    name: "Certificate of Indigency",
    description: "For qualified residents needing assistance",
    fee: "Free",
    icon: User,
    color: "bg-green-500",
  },
  {
    name: "Certificate of Residency",
    description: "Proof of residence in the barangay",
    fee: "₱30.00",
    icon: FileText,
    color: "bg-yellow-500",
  },
  {
    name: "Business Permit",
    description: "Local business registration and permits",
    fee: "₱100.00",
    icon: DollarSign,
    color: "bg-destructive",
  },
];

export default function Documents() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">
            Generate, track, and manage barangay documents and certificates
          </p>
        </div>
        <Button className="shadow-primary">
          <Plus className="h-4 w-4" />
          Issue New Document
        </Button>
      </div>

      {/* Document Types Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {documentTypes.map((docType) => {
          const Icon = docType.icon;
          return (
            <Card
              key={docType.name}
              className="cursor-pointer transition-all hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${docType.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{docType.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {docType.description}
                    </p>
                    <p className="text-sm font-medium text-primary mt-2">
                      {docType.fee}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Issued
                </p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  This Month
                </p>
                <p className="text-2xl font-bold text-success">156</p>
              </div>
              <Calendar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-warning">12</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Revenue
                </p>
                <p className="text-2xl font-bold text-primary">₱78,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by document ID, resident name..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Document ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Resident
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Purpose
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Date Issued
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Fee
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr
                    key={document.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium">{document.id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{document.type}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{document.residentName}</p>
                        <p className="text-sm text-muted-foreground">
                          Issued by: {document.issuedBy}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{document.purpose}</td>
                    <td className="py-3 px-4">{document.dateIssued}</td>
                    <td className="py-3 px-4">₱{document.fee}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className={
                          document.status === "Issued"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }
                      >
                        {document.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing 1-4 of 1,247 documents
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
