"use client";

import * as React from "react";
import Image from "next/image";
import { Cross2Icon, FileTextIcon, UploadIcon } from "@radix-ui/react-icons";
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from "react-dropzone";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useControllableState } from "@/hooks/use-controllable-state";
import { Button } from "@/components/ui/button";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[];

  /**
   * Function to be called when the value changes.
   * @type (files: File[]) => void
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: File[]) => void;

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps["accept"];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps["maxSize"];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFileCount={4}
   */
  maxFileCount?: DropzoneProps["maxFiles"];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;

  /**
   * Additional class name for the uploader.
   * @type string | undefined
   * @default undefined
   * @example defvalue="https://example.com/logo.png"
   */
  defvalue?: string;
}

export function InvoiceFileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    defvalue,
    accept = {
      "image/*": [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    const createFileFromUrl = async (url: string | null) => {
      if (!url) return null;
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], "logo.png", {
        type: "image/png",
      });
      //@ts-ignore
      file.preview = url;
      return file;
    };
    const preview = createFileFromUrl(defvalue as string);
    preview.then((file) => setFiles(file ? [file] : []));
  }, []);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error("Cannot upload more than 1 file at a time");
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        toast.error(`Cannot upload more than ${maxFileCount} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFileCount
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

        setIsUploading(true);
        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setIsUploading(false);
            // Only clear files after successful upload
            return `${target} uploaded`;
          },
          error: (err) => {
            setIsUploading(false);
            return `Failed to upload ${target}`;
          },
        });
      }
    },
    [files, maxFileCount, multiple, onUpload, setFiles],
  );
  function onRemove(index: number) {
    if (!files || isUploading) return; // Prevent removal during upload
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Cleanup preview URLs
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const isDisabled =
    disabled || (files?.length ?? 0) >= maxFileCount || isUploading;

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      {(!files || files.length === 0) && (
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFileCount}
          multiple={maxFileCount > 1 || multiple}
          disabled={isDisabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                "group relative grid size-20 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-1 text-center transition hover:bg-muted/25",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isDragActive && "border-muted-foreground/50",
                isDisabled && "pointer-events-none opacity-60",
                className,
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          )}
        </Dropzone>
      )}
      {files?.length ? (
        <div className="flex size-20 flex-col gap-4">
          {files?.map((file, index) => (
            <FileCard
              key={index}
              file={file}
              defvalue={defvalue}
              onRemove={() => onRemove(index)}
              progress={progresses?.[file.name]}
              isUploading={isUploading}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  defvalue?: string;
  progress?: number;
  isUploading: boolean;
}

function FileCard({
  file,
  progress,
  defvalue,
  onRemove,
  isUploading,
}: FileCardProps) {
  return (
    <div className="relative flex items-center gap-2.5">
      {isFileWithPreview(file) ? <FilePreview file={file} /> : null}

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute right-1 top-1 size-5 bg-red-500 text-white"
        onClick={onRemove}
        disabled={isUploading}
      >
        <Cross2Icon className="size-4" aria-hidden="true" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  if (typeof file !== "object" || file === null) return false;
  return "preview" in file && typeof file.preview === "string";
}

interface FilePreviewProps {
  file: File & { preview: string };
}

function FilePreview({ file }: FilePreviewProps) {
  if (file.type.startsWith("image/")) {
    return (
      <Image
        src={file.preview}
        alt={file.name}
        width={128}
        height={128}
        loading="lazy"
        className="aspect-square size-20 shrink-0 rounded-md object-contain"
      />
    );
  }

  return (
    <FileTextIcon
      className="size-10 text-muted-foreground"
      aria-hidden="true"
    />
  );
}
