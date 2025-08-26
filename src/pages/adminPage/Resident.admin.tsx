import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
} from "lucide-react";

const residents = [
  {
    id: 1,
    fullName: "Juan Dela Cruz",
    age: 35,
    gender: "Male",
    civilStatus: "Married",
    address: "Block 1, Lot 15, Barangay Example",
    contactNumber: "09123456789",
    occupation: "Teacher",
    status: "Active",
  },
  {
    id: 2,
    fullName: "Maria Santos",
    age: 28,
    gender: "Female",
    civilStatus: "Single",
    address: "Block 2, Lot 8, Barangay Example",
    contactNumber: "09987654321",
    occupation: "Nurse",
    status: "Active",
  },
  {
    id: 3,
    fullName: "Pedro Rodriguez",
    age: 45,
    gender: "Male",
    civilStatus: "Married",
    address: "Block 3, Lot 22, Barangay Example",
    contactNumber: "09555123456",
    occupation: "Driver",
    status: "Active",
  },
  {
    id: 4,
    fullName: "Ana Garcia",
    age: 33,
    gender: "Female",
    civilStatus: "Widow",
    address: "Block 1, Lot 5, Barangay Example",
    contactNumber: "09777888999",
    occupation: "Seamstress",
    status: "Active",
  },
];

export default function Residents() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resident Management</h1>
          <p className="text-muted-foreground">
            Manage and track all registered residents in your barangay
          </p>
        </div>
        <Link to="/admin/addResident">
          <Button className="shadow-primary">
            <Plus className="h-4 w-4" />
            Add New Resident
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Residents
                </p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-success">45</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <Plus className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Male
                </p>
                <p className="text-2xl font-bold">1,453</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Female
                </p>
                <p className="text-2xl font-bold">1,394</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
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
                  placeholder="Search residents by name, address, or contact..."
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

      {/* Residents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Residents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Age
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Gender
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Civil Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Occupation
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Contact
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
                {residents.map((resident) => (
                  <tr
                    key={resident.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{resident.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {resident.address}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{resident.age}</td>
                    <td className="py-3 px-4">{resident.gender}</td>
                    <td className="py-3 px-4">{resident.civilStatus}</td>
                    <td className="py-3 px-4">{resident.occupation}</td>
                    <td className="py-3 px-4">{resident.contactNumber}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className="bg-success/10 text-success"
                      >
                        {resident.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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
              Showing 1-4 of 2,847 residents
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
