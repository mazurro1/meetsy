import {NextPage} from "next";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {withSiteProps, withTranslates} from "@hooks";
import shortid from "shortid";
import {
  FetchData,
  HiddenContent,
  ButtonIcon,
  GenerateIcons,
  Paragraph,
  Tooltip,
} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import {useState, useEffect, useRef} from "react";
import Image from "next/image";
import {Colors} from "@constants";
import {changeLoadingVisible} from "@/redux/site/actions";
import {
  PositionAddIcon,
  PotisionButtonDelete,
  UploadImageStyle,
} from "./UploadImage.style";
import type {UploadImageProps} from "./UploadImage.model";

const UploadImage: NextPage<
  UploadImageProps & ISiteProps & ITranslatesProps
> = ({
  dispatch,
  siteProps,
  handleUpload = () => {},
  id = "",
  enable = true,
  tooltip = "",
  texts,
}) => {
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!!fileImage) {
      const objectUrl = URL.createObjectURL(fileImage);
      setPreviewImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [fileImage]);

  const handleAddNewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      const typeFileValue: number = file.name.lastIndexOf(".");
      const typeImage: string = file.name
        .slice(typeFileValue + 1, file.name.length)
        .toLowerCase();

      const acceptTypeImages: string[] = ["png", "jpg", "jpeg"];
      const hasType: boolean = acceptTypeImages.some(
        (item) => item === typeImage.toLowerCase()
      );
      if (hasType) {
        if (file.size <= 5e6) {
          setFileImage(file);
        } else {
          dispatch!(addAlertItem(texts!.errorSizeImage, "RED"));
        }
      }
    }
  };

  const handleDeleteImage = () => {
    setFileImage(null);
    setPreviewImage(null);
    if (!!refInput) {
      if (!!refInput.current) {
        refInput.current.value = "";
      }
    }
  };

  const handleUploadImage = () => {
    if (!!fileImage) {
      const file = fileImage;
      const typeFileValue: number = file.name.lastIndexOf(".");
      const typeImage: string = file.name
        .slice(typeFileValue + 1, file.name.length)
        .toLowerCase();

      const acceptTypeImages: string[] = ["png", "jpg", "jpeg"];
      const hasType: boolean = acceptTypeImages.some(
        (item) => item === typeImage.toLowerCase()
      );
      if (hasType) {
        const date = new Date();
        dispatch?.(changeLoadingVisible(true));
        FetchData({
          url: "/api/images",
          method: "POST",
          dispatch: dispatch,
          language: siteProps?.language,
          disabledLoader: true,
          data: {
            // to do generate save image in aws int /company and /user
            type: file.type,
            name: `${shortid.generate()}-${shortid.generate()}-${shortid.generate()}-${shortid.generate()}-${shortid.generate()}-${date.getTime()}.${typeImage}`,
          },
          callback: async (data) => {
            if (data.success) {
              if (!!data.data.url) {
                const responseupload = await fetch(data.data.url, {
                  method: "PUT",
                  body: file,
                  headers: {
                    "Content-type": file.type,
                  },
                });
                handleUpload(responseupload.url);
                await handleDeleteImage();
                dispatch!(addAlertItem(texts!.addedImage, "GREEN"));
              }
            } else {
              dispatch!(addAlertItem(texts!.errorAddedImage, "RED"));
            }
            dispatch?.(changeLoadingVisible(false));
          },
        });
      } else {
        dispatch!(addAlertItem(texts!.errorTypeImage, "RED"));
      }
    }
  };

  const colorBorder = Colors(siteProps).dangerColor;

  return (
    <HiddenContent enable={enable} effect="popup">
      <UploadImageStyle colorBorder={colorBorder}>
        {!!previewImage ? (
          <div className="relative">
            <div className="image">
              <Image src={previewImage} alt="" width={400} height={300} />
            </div>
            <PotisionButtonDelete>
              <div>
                <ButtonIcon
                  id={id + "_delete_button"}
                  color="RED"
                  onClick={handleDeleteImage}
                  iconName="TrashIcon"
                >
                  {texts!.deleteImage}
                </ButtonIcon>
              </div>
              <div>
                <ButtonIcon
                  id={id + "_save_button"}
                  color="GREEN"
                  isFetchToBlock
                  onClick={handleUploadImage}
                  iconName="SaveIcon"
                >
                  {texts!.saveImage}
                </ButtonIcon>
              </div>
            </PotisionButtonDelete>
          </div>
        ) : (
          <Tooltip enable={!!tooltip} text={tooltip} display="block">
            <label htmlFor={id}>
              <div className="relative">
                <div className="mainImage">
                  <Paragraph color="GREY_LIGHT">
                    <GenerateIcons iconName="PhotographIcon" />
                  </Paragraph>
                </div>
                <PositionAddIcon>
                  <Paragraph color="GREY_DARK">
                    <GenerateIcons iconName="PlusCircleIcon" />
                  </Paragraph>
                </PositionAddIcon>
              </div>
            </label>
          </Tooltip>
        )}
        <input
          type="file"
          onChange={handleAddNewImage}
          id={id}
          accept="image/*"
          ref={refInput}
        />
      </UploadImageStyle>
    </HiddenContent>
  );
};
export default withSiteProps(withTranslates(UploadImage, "UploadImage"));
