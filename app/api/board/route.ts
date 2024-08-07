import User from "@/models/User";
// import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "@/utils/db";

export const GET = async (request: any) => {
  await connect()

    const user = await User.aggregate(
        [
            {
                "$project":{
                    "length":{"$size":"$images"},
                    "fname":1,
                    "average":1,
                }
            },
            {"$sort":{"length":-1,"average":1}},
            {"$limit":10}
            
        ]
    );
    console.log(user);

  return NextResponse.json(user);

}

  