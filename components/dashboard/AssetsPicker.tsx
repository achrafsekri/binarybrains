"use client";

import React from "react";
import { uploadFilesToServer } from "@/actions/upload-files.server";
import { PlusIcon } from "lucide-react";

import { logger } from "@/lib/logger";
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
const AssetsPicker = ({
  type,
  taskId,
}: {
  type: "EMPTY" | "NOT_EMPTY";
  taskId: string;
}) => {
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
              resolve({
                name: file.name,
                url: signedUrl,
                id: "haha",
                type: file.type,
              });
            } catch (error) {
              logger.error("Error uploading file", error);
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
      const filesToUpload = (await Promise.all(files.map(uploadFile))) as {
        name: string;
        url: string;
        id: string;
        type: string;
      }[];
      await uploadFilesToServer(taskId, filesToUpload);
      logger.info("All files uploaded successfully");
      setIsUploading(false);
      setOpen(false);
    } catch (error) {
      logger.error("Some files failed to upload", error);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "EMPTY" ? (
          <div className="mt-4 flex h-36 cursor-pointer flex-col items-center justify-center space-y-2 border-2 border-dashed border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-900">
            <h3 className="text-lg font-semibold text-gray-500">
              No assets uploaded yet
            </h3>
            <p className="text-sm text-gray-400">Add assets to get started</p>
          </div>
        ) : (
          <div className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-900">
            <PlusIcon className="h-8 w-8 text-gray-500" />
          </div>
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
          maxSize={100 * 1024 * 1024}
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
