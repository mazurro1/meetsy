export interface UploadImageProps {
  handleUpload: (url: string) => void;
  id: string;
  enable?: boolean;
  tooltip?: string;
}
