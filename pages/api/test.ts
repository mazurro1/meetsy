import type {NextApiRequest, NextApiResponse} from "next";
import Products from "@/models/textProduct";
import dbConnect from "@/utils/dbConnect";

type Data = {
  success: boolean;
  data?: any;
};

dbConnect();
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return Products.find()
    .then((results) => {
      return res.status(200).json({
        success: true,
        data: results,
      });
    })
    .catch(() => {
      return res.status(400).json({
        success: false,
      });
    });
}

export const config = {
  api: {
    externalResolver: true,
  },
};
