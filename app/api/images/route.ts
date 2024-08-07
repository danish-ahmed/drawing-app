import User from "@/models/User";
// import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "@/utils/db";

export const GET = async (request: any) => {
  await connect()
  const email = request.url.split('?')[1].split('=')[1];
  const user = await User.findOne({ email });
  return NextResponse.json(user);
}

export const POST = async (request: any) => {
  await connect()
  const { image, aiResponse, email } = await request.json();
  const user = await User.findOne({ email });

  if (user) {
    
   
    // console.log(mySubString);
    const marks = aiResponse.final_score;

    const imageObj = {
      imageUri:image,
      aiFeedback:aiResponse.composition,
      marks:marks
    }
    user.images.push(
      imageObj
    );
    const average = user.images.length>0 ? user.images.reduce((total:any, next:any) => total + next.marks, 0) / user.images.length : 0;
    user.average = average;
    // user.imageUri = image;
    // user.aiFeedback= aiResponse;
    // user.marks = 90
    // await user.save()
    try {
      const newUser = await user.save();

      return NextResponse.json(newUser);
    } catch (err: any) {
      return new NextResponse(err, {
        status: 500,
      });
    }
  }else{
    return new NextResponse("User Not found", { status: 400 });
  }

  
  
};