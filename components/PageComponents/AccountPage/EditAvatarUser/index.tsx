import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, UploadImage} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {updateUserProps} from "@/redux/user/actions";

interface EditAvatarUserProps {
  showEditAvatarUser: boolean;
  handleShowEditAvatarUser: () => void;
}

const EditAvatarUser: NextPage<
  ITranslatesProps & ISiteProps & EditAvatarUserProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showEditAvatarUser,
  handleShowEditAvatarUser,
  user,
}) => {
  const handleDeleteUserAvatar = () => {
    FetchData({
      url: "/api/user/account/avatar",
      method: "DELETE",
      dispatch: dispatch,
      language: siteProps?.language,
      callback: (data) => {
        if (data.success) {
          dispatch!(
            updateUserProps([
              {
                folder: "userDetails",
                field: "avatarUrl",
                value: null,
              },
            ])
          );
        }
      },
    });
  };

  const handleSetUserAvatar = (avatarUrl: string) => {
    FetchData({
      url: "/api/user/account/avatar",
      method: "PATCH",
      dispatch: dispatch,
      language: siteProps?.language,
      data: {
        avatarUrl: avatarUrl,
      },
      callback: (data) => {
        if (data.success) {
          dispatch!(
            updateUserProps([
              {
                folder: "userDetails",
                field: "avatarUrl",
                value: avatarUrl,
              },
            ])
          );
        }
      },
    });
  };

  return (
    <Popup
      popupEnable={showEditAvatarUser}
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowEditAvatarUser}
      id="change_avatar_user_account_popup"
    >
      <div>
        <div className="flex-center-center mb-20">
          <UploadImage
            handleUpload={handleSetUserAvatar}
            handleDelete={handleDeleteUserAvatar}
            isMainImage
            id="upload_user_image"
            tooltip="Dodaj zdjęcie profilowe"
            type="USER"
            defaultImage={
              !!user?.userDetails.avatarUrl ? user.userDetails.avatarUrl : ""
            }
          />
        </div>
        <div className="flex-end-center">
          <ButtonIcon
            id="come_out_edit_avatar"
            onClick={handleShowEditAvatarUser}
            iconName="ArrowLeftIcon"
          >
            {texts!.comeOut}
          </ButtonIcon>
        </div>
      </div>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(EditAvatarUser)),
  "EditAvatarUser"
);
