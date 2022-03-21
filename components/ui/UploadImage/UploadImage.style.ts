import styled from "styled-components";

export const UploadImageStyle = styled.div<{
  colorBorder: string;
}>`
  height: 300px;
  width: 400px;
  max-width: 100%;
  max-height: 100%;
  input {
    display: none;
  }

  label {
    height: 300px;
    width: 400px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 2px dashed rgba(0, 0, 0, 0.5);
    transition-property: background-color, border-color;
    transition-duration: 0.3s;
    transition-timing-function: ease;

    .mainImage {
      p {
        svg {
          height: 200px;
          width: 200px;
        }
      }
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }

  .image {
    border: 3px solid ${(props) => props.colorBorder};
    border-radius: 5px;
    height: 302px;
  }
`;

export const PotisionButtonDelete = styled.div`
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 10px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0);
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

export const PositionAddIcon = styled.div`
  position: absolute;
  right: -5px;
  top: -0px;

  svg {
    height: 100px;
    width: 100px;
  }
`;
