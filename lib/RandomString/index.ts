export const randomString = (length: number): string => {
  var result: string = "";
  var characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
