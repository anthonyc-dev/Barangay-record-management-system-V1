import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Search,
  Filter,
  Download,
  FileText,
  File,
  Folder,
  FolderPlus,
  Edit3,
  Trash2,
  Move,
  Grid,
  List,
  Calendar,
  HardDrive,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";

const FileStorage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Mock data
  const folders = [
    { id: "1", name: "Documents", fileCount: 12 },
    { id: "2", name: "Reports", fileCount: 8 },
    { id: "3", name: "Templates", fileCount: 5 },
  ];

  const files = [
    {
      id: "f1",
      name: "Budget Report 2024.xlsx",
      type: "Excel",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      folder: "Reports",
    },
    {
      id: "f2",
      name: "Barangay Guidelines.pdf",
      type: "PDF",
      size: "1.8 MB",
      uploadDate: "2024-01-14",
      folder: "Documents",
    },
    {
      id: "f3",
      name: "Meeting Minutes.docx",
      type: "Word",
      size: "856 KB",
      uploadDate: "2024-01-13",
      folder: "Documents",
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "word":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "excel":
        return <FileText className="h-8 w-8 text-green-500" />;
      case "powerpoint":
        return <FileText className="h-8 w-8 text-orange-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      // Add folder creation logic here
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null) return 0;
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setUploadProgress(null), 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File Storage</h1>
          <p className="text-muted-foreground">
            Upload, organize, and manage your files
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Drag and drop files here
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              multiple
              accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: DOC, DOCX, XLS, XLSX, PPT, PPTX, PDF
            </p>
          </div>

          {/* Upload Progress */}
          {uploadProgress !== null && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Actions */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button
          onClick={() => setIsCreatingFolder(true)}
          size="sm"
          className="flex items-center space-x-2"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Folder</span>
        </Button>
      </div>

      {/* Create Folder Dialog */}
      {isCreatingFolder && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCreateFolder} size="sm">
                Create
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCreatingFolder(false);
                  setNewFolderName("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Folders Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Folder className="h-5 w-5 mr-2" />
          Folders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedFolder(folder.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Folder className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{folder.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {folder.fileCount} files
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <HardDrive className="h-5 w-5 mr-2" />
          Files
        </h2>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files
              .filter(
                (file) =>
                  !selectedFolder ||
                  folders.find((f) => f.id === selectedFolder)?.name ===
                    file.folder
              )
              .map((file) => (
                <Card
                  key={file.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {file.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {file.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {file.size}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{file.uploadDate}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Move className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {files
                  .filter(
                    (file) =>
                      !selectedFolder ||
                      folders.find((f) => f.id === selectedFolder)?.name ===
                        file.folder
                  )
                  .map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-center space-x-4">
                        {getFileIcon(file.type)}
                        <div>
                          <h3 className="font-medium">{file.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Size: {file.size}</span>
                            <span>Type: {file.type}</span>
                            <span>Uploaded: {file.uploadDate}</span>
                            <span>Folder: {file.folder}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Move className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FileStorage;
