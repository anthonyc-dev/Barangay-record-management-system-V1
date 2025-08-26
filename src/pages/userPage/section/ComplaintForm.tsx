"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Upload, MapPin, Calendar, AlertTriangle } from "lucide-react";

const ComplaintForm = () => {
  const [files, setFiles] = useState<File[]>([]);

  const complaintTypes = [
    "Infrastructure Issues",
    "Public Safety",
    "Environmental Concerns",
    "Noise Complaint",
    "Utilities",
    "Health & Sanitation",
    "Traffic & Transportation",
    "Other",
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  return (
    <section
      id="complaint"
      className="py-16 min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200"
    >
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-3 tracking-tight">
            File a Complaint or Report
          </h2>
          <p className="text-base md:text-lg text-blue-800/80 max-w-2xl mx-auto">
            Help us improve our community by reporting issues that matter to you
            and your neighbors.
          </p>
        </div>

        <Card className="shadow-xl border border-blue-200 bg-white/90 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white rounded-t-2xl p-6">
            <CardTitle className="flex items-center gap-3 text-lg md:text-2xl font-bold">
              <AlertTriangle className="w-7 h-7 text-yellow-300" />
              New Complaint Form
            </CardTitle>
            <CardDescription className="text-white/80 text-sm mt-1">
              Please provide detailed information to help us address your
              concern effectively.
            </CardDescription>
          </CardHeader>
          <CardContent className="md:p-10 space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-5">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="font-semibold text-blue-900"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="mt-2 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="font-semibold text-blue-900"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="mt-2 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="font-semibold text-blue-900"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+63 9XX XXX XXXX"
                    className="mt-2 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Complaint Details */}
              <div className="space-y-5">
                <div>
                  <Label
                    htmlFor="complaintType"
                    className="font-semibold text-blue-900"
                  >
                    Complaint Type <span className="text-red-500">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger
                      className="mt-2 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500 w-full"
                      style={{ minWidth: "100%" }}
                    >
                      <SelectValue placeholder="Select complaint type" />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type.toLowerCase().replace(/\s+/g, "-")}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="priority"
                    className="font-semibold text-blue-900"
                  >
                    Priority Level
                  </Label>
                  <Select>
                    <SelectTrigger
                      className="mt-2 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500 w-full"
                      style={{ minWidth: "100%" }}
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="location"
                    className="font-semibold text-blue-900"
                  >
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <Input
                      id="location"
                      placeholder="Street, Purok, or landmark"
                      className="pl-11 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="font-semibold text-blue-900"
              >
                Detailed Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Please provide a detailed description of the issue, including when it occurred, who was involved, and any other relevant information..."
                className="mt-2 min-h-[120px] bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="files" className="font-semibold text-blue-900">
                Attachments (Images, Videos, Documents)
              </Label>
              <div className="mt-2 border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-blue-50/60">
                <Upload className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-800/80 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  asChild
                  className="mt-1 border-blue-400 text-blue-700 hover:bg-blue-100"
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
                {files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {files.map((file, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full"
                      >
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label
                  htmlFor="incidentDate"
                  className="font-semibold text-blue-900"
                >
                  Incident Date
                </Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <Input
                    id="incidentDate"
                    type="date"
                    className="pl-11 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="incidentTime"
                  className="font-semibold text-blue-900"
                >
                  Incident Time
                </Label>
                <Input
                  id="incidentTime"
                  type="time"
                  className="mt-2 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="anonymous"
                className="rounded border-blue-300 focus:ring-blue-500 accent-blue-600 w-5 h-5"
              />
              <Label
                htmlFor="anonymous"
                className="text-sm text-blue-900 font-medium cursor-pointer"
              >
                Submit this complaint anonymously
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col md:flex-row gap-4 pt-8">
              <Button className="flex-[4] bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white font-bold py-3 rounded-lg shadow hover:opacity-90 transition">
                Submit Complaint
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-blue-400 text-blue-700 font-semibold py-3 rounded-lg hover:bg-blue-100 transition"
              >
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ComplaintForm;
