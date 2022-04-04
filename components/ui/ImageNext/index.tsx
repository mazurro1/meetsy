import {NextPage} from "next";
import Image from "next/image";

interface ImageNextProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  onLoadingComplete?: () => void;
}

const ImageNext: NextPage<ImageNextProps> = (props) => {
  return <Image {...props} alt={props.alt} />;
};
export default ImageNext;
