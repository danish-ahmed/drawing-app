import User from "@/models/User";
// import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "@/utils/db";

export const GET = async (request: any) => {
  await connect()
    console.log('HELLO---BOARD');
    const user = await User.aggregate(
        [
            {
                "$project":{
                    "score":{"$max":"$images.marks"},
                    "fname":1,
                    "email":1,
                    // "average":1,
                }
            },
            {"$sort":{"score":-1}},
            {"$limit":10}
            
        ]
    );

  return NextResponse.json(user);

}

  