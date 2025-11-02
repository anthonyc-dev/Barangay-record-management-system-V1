import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Folder,
  FileText,
  Download,
  Eye,
  Trash2,
  Search,
  Calendar,
  User,
  FolderPlus,
  FilePlus,
} from "lucide-react";
import { FaFolder } from "react-icons/fa";

const FolderStorage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for folders and files
  const folders = [
    {
      id: 1,
      name: "Barangay Documents",
      type: "folder",
      size: "2.3 MB",
      modified: "2024-01-15",
      modifiedBy: "Admin User",
      items: 12,
    },
    {
      id: 2,
      name: "Resident Records",
      type: "folder",
      size: "15.7 MB",
      modified: "2024-01-14",
      modifiedBy: "Secretary",
      items: 45,
    },
    {
      id: 3,
      name: "Financial Reports",
      type: "folder",
      size: "8.1 MB",
      modified: "2024-01-13",
      modifiedBy: "Treasurer",
      items: 23,
    },
    {
      id: 4,
      name: "Meeting Minutes - January 2024.pdf",
      type: "file",
      size: "512 KB",
      modified: "2024-01-12",
      modifiedBy: "Admin User",
      items: null,
    },
    {
      id: 5,
      name: "Barangay Ordinances",
      type: "folder",
      size: "5.2 MB",
      modified: "2024-01-11",
      modifiedBy: "Captain",
      items: 8,
    },
    {
      id: 6,
      name: "Budget Proposal 2024.xlsx",
      type: "file",
      size: "1.2 MB",
      modified: "2024-01-10",
      modifiedBy: "Treasurer",
      items: null,
    },
  ];

  const filteredFolders = folders.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getFileIcon = (type: string) => {
    return type === "folder" ? (
      <FaFolder className="h-7 w-7 text-blue-600" />
    ) : (
      <FileText className="h-7 w-7 text-gray-600" />
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Folder Storage</h1>
          <p className="text-gray-600">
            Manage and organize barangay documents and files
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <FolderPlus className="h-4 w-4" />
            <span>Upload Folder</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <FilePlus className="h-4 w-4" />
            <span>Upload Files</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search folders and files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files and Folders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="h-5 w-5" />
            <span>Files and Folders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead>Modified By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFolders.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(item.type)}
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        {item.type === "folder" && item.items && (
                          <div className="text-sm text-gray-500">
                            {item.items} items
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">
                      {formatFileSize(item.size)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {formatDate(item.modified)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{item.modifiedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredFolders.length === 0 && (
            <div className="text-center py-8">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No files or folders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Get started by uploading some files or creating a folder"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FolderStorage;
