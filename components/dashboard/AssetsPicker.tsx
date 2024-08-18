"use client";

import React, { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FileUploader } from "../shared/file-uploader";

// if assets is empty, it will show a big button to add first asset else it will show a plus icon to add more assets
const AssetsPicker = ({ type }: { type: "EMPTY" | "NOT_EMPTY" }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const uploadFiles = async () => {
    setIsUploading(true);
    if (files.length === 0) return;

    const uploadFile = async (file: File) => {
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = async (event) => {
          const fileData = event.target?.result;

          if (fileData) {
            try {
              const presignedURL = new URL(
                "/api/presigned",
                window.location.href,
              );
              presignedURL.searchParams.set("fileName", file.name);
              presignedURL.searchParams.set("contentType", file.type);

              const res = await fetch(presignedURL.toString());
              const { signedUrl } = await res.json();

              const body = new Blob([fileData], { type: file.type });

              await fetch(signedUrl, {
                body,
                method: "PUT",
              });

              // Save reference to the object in Postgres (powered by Neon)
              resolve("file uploaded successfully");
            } catch (error) {
              console.error("Upload failed for file:", file.name, error);
              reject(error); // Reject the promise if any error occurs
            }
          } else {
            reject("File data is empty");
          }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    };

    try {
      await Promise.all(files.map(uploadFile));
      console.log("All files uploaded successfully");
      setIsUploading(false);
    } catch (error) {
      console.error("Some files failed to upload", error);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "EMPTY" ? (
          <div className="mt-4 flex h-36 cursor-pointer flex-col items-center justify-center space-y-2 border-2 border-dashed border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-500">
              No assets uploaded yet
            </h3>
            <p className="text-sm text-gray-400">Add assets to get started</p>
          </div>
        ) : (
          <Button onClick={() => setOpen(true)}>Add more assets</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            Drag and drop your files here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <FileUploader
          maxFileCount={8}
          maxSize={8 * 1024 * 1024}
          onValueChange={setFiles}
          accept={{
            "image/*": [],
            "video/*": [],
            "audio/*": [],
            "application/pdf": [],
            "text/*": [],
            "application/msword": [],
            "application/vnd.ms-excel": [],
            "application/vnd.ms-powerpoint": [],
            "application/vnd.openxmlformats-officedocument.presentationml.presentation":
              [],
          }}
        />
        <DialogFooter>
          <Button type="button" onClick={uploadFiles}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssetsPicker;
