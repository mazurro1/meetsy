import dbConnect from "@/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@lib";
import User from "@/models/user";

type Data = {
  success: boolean;
  data?: any;
  message?: string;
};

dbConnect();
async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body;
  const { email, password } = data;
  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      success: false,
      message:
        "Invalid input - password should also be at least 7 characters long.",
    });
    return;
  }

  User.findOne({
    email: email,
  })
    .select("email")
    .then(async (user) => {
      if (!!user) {
        res
          .status(422)
          .json({ success: false, message: "User exists already!" });
      } else {
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
          email: email,
          name: "Jan",
          surname: "Kowalski",
          password: hashedPassword,
        });
        return newUser.save();
      }
    })
    .then((createdUser) => {
      res
        .status(201)
        .json({ message: "Created user!", data: createdUser, success: true });
    });
}
export default handler;
