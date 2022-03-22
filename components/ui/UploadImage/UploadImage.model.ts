export interface UploadImageProps {
  handleUpload: (url: string) => void;
  handleDelete: (url: string) => void;
  handleMainImage?: (url: string) => void;
  isMainImage?: boolean;
  id: string;
  enable?: boolean;
  tooltip?: string;
  defaultImage?: string;
  type: "COMPANY" | "USER";
}
