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
  Trash2,
  Grid,
  List,
  Calendar,
  HardDrive,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Share2,
} from "lucide-react";
import { useState, useRef } from "react";

const FileStorage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed file types with specific extensions
  const allowedFileTypes = {
    documents: [".doc", ".docx"],
    spreadsheets: [".xls", ".xlsx"],
    presentations: [".ppt", ".pptx"],
    pdf: [".pdf"],
  };

  const allowedExtensions = Object.values(allowedFileTypes).flat().join(",");

  // Mock data
  const folders = [
    {
      id: "1",
      name: "Documents",
      fileCount: 12,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "2",
      name: "Reports",
      fileCount: 8,
      color: "bg-green-100 text-green-800",
    },
    {
      id: "3",
      name: "Templates",
      fileCount: 5,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "4",
      name: "Presentations",
      fileCount: 3,
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const files = [
    {
      id: "f1",
      name: "Budget Report 2024.xlsx",
      type: "Excel",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      folder: "Reports",
      extension: ".xlsx",
    },
    {
      id: "f2",
      name: "Barangay Guidelines.pdf",
      type: "PDF",
      size: "1.8 MB",
      uploadDate: "2024-01-14",
      folder: "Documents",
      extension: ".pdf",
    },
    {
      id: "f3",
      name: "Meeting Minutes.docx",
      type: "Word",
      size: "856 KB",
      uploadDate: "2024-01-13",
      folder: "Documents",
      extension: ".docx",
    },
    {
      id: "f4",
      name: "Annual Presentation.pptx",
      type: "PowerPoint",
      size: "5.2 MB",
      uploadDate: "2024-01-12",
      folder: "Presentations",
      extension: ".pptx",
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "word":
        return <FileText className="h-10 w-10 text-blue-600" />;
      case "excel":
        return <FileText className="h-10 w-10 text-green-600" />;
      case "powerpoint":
        return <FileText className="h-10 w-10 text-orange-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-800 border-red-200";
      case "word":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "excel":
        return "bg-green-100 text-green-800 border-green-200";
      case "powerpoint":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const validateFileType = (file: File): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    return Object.values(allowedFileTypes).flat().includes(fileExtension);
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!validateFileType(file)) {
      setUploadError(
        "Invalid file type. Only DOC, DOCX, XLS, XLSX, PPT, PPTX, and PDF files are allowed."
      );
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
      return;
    }

    setUploadError(null);
    setUploadSuccess(false);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setUploadSuccess(true);
          setTimeout(() => {
            setUploadProgress(null);
            setUploadSuccess(false);
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const file = droppedFiles[0];
      processFile(file);
    }
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFolder(null);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            File Storage Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Securely upload, organize, and manage your administrative documents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="border-2 hover:border-primary"
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4 mr-2" />
            ) : (
              <Grid className="h-4 w-4 mr-2" />
            )}
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
        </div>
      </div>

      {/* Enhanced Upload Area */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <span>Upload Administrative Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer ${
              isDragOver
                ? "border-primary bg-primary/10"
                : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleSelectFiles}
          >
            <div className="space-y-4">
              <div
                className={`p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center transition-colors ${
                  isDragOver ? "bg-primary/20" : "bg-primary/10"
                }`}
              >
                <Upload
                  className={`h-10 w-10 transition-colors ${
                    isDragOver ? "text-primary" : "text-primary"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {isDragOver
                    ? "Drop your files here"
                    : "Drag and drop your files here"}
                </h3>
                <p className="text-muted-foreground">
                  or click to browse from your computer
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={allowedExtensions}
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                size="lg"
                className="cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectFiles();
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Select Files
              </Button>
            </div>
          </div>

          {/* File Type Information */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
              Supported File Types
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <FileText className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">PDF</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Word (.doc, .docx)</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Excel (.xls, .xlsx)</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <FileText className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">
                  PowerPoint (.ppt, .pptx)
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Maximum file size: 10MB per file
            </p>
          </div>

          {/* Upload Progress */}
          {uploadProgress !== null && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Uploading file...</span>
                <span className="text-primary font-semibold">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Success */}
          {uploadSuccess && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">File uploaded successfully!</span>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{uploadError}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Search and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 border-2 focus:border-primary"
                />
              </div>

              {selectedFolder && (
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  className="border-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="default"
              className="border-2 hover:border-primary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Files Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <HardDrive className="h-6 w-6 text-green-600" />
            </div>
            Files
            {selectedFolder && (
              <Badge variant="outline" className="ml-3">
                {folders.find((f) => f.id === selectedFolder)?.name} Folder
              </Badge>
            )}
          </h2>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary group"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-primary/10 transition-colors">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate mb-2">
                            {file.name}
                          </h3>
                          <div className="space-y-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs border ${getFileTypeColor(
                                file.type
                              )}`}
                            >
                              {file.type}
                            </Badge>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span className="font-medium">{file.size}</span>
                              <span>•</span>
                              <span>{file.extension}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Uploaded: {file.uploadDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {file.folder}
                        </Badge>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-green-50"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-purple-50"
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <Card className="border-2">
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
                      className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-primary/10 transition-colors">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{file.name}</h3>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Size:</span>
                              <span>{file.size}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="secondary"
                                className={`text-xs border ${getFileTypeColor(
                                  file.type
                                )}`}
                              >
                                {file.type} {file.extension}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3" />
                              <span>Uploaded: {file.uploadDate}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {file.folder}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-purple-50"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50 hover:text-red-600"
                        >
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
