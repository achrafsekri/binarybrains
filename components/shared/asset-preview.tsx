import React from "react";
import type { Asset } from "@prisma/client";
import { File, FileAudio, FileVideo } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const AssetPreview = ({
  asset,
  watermark,
}: {
  asset: Asset;
  watermark: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="aspect-square w-full">
        {asset.type === "IMAGE" ? (
          <div className="relative w-full">
            <img
              src={asset.url}
              alt={asset.name}
              className="aspect-square w-full cursor-pointer rounded-md object-cover hover:opacity-80"
            />
            {watermark && (
              <div className="absolute  inset-0 flex items-center justify-center bg-opacity-50 text-lg font-semibold text-white">
                Watermarked
              </div>
            )}
          </div>
        ) : asset.type === "VIDEO" ? (
          <div className="flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-900">
            <FileVideo className="h-12 w-12 text-gray-500 dark:text-gray-300" />
          </div>
        ) : (
          <div className="flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-900">
            <FileAudio className="h-12 w-12 text-gray-500 dark:text-gray-300" />
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        {asset.type === "IMAGE" ? (
          <img src={asset.url} alt={asset.name} className="w-full" />
        ) : asset.type === "VIDEO" ? (
          <video src={asset.url} controls className="max-h-96 w-full" />
        ) : asset.type === "AUDIO" ? (
          <audio src={asset.url} controls className="w-full" />
        ) : (
          <a href={asset && asset.url} target="_blank" rel="noreferrer">
            {asset.name}
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssetPreview;
