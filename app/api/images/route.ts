import User from "@/models/User";
// import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "@/utils/db";

export const GET = async (request: any) => {
  await connect()
  const email = decodeURIComponent(request.url.split('?')[1].split('=')[1]);
  console.log(email)
  try{
    const user = await User.findOne({ email:"admin@admin.com" }).sort({'images.createdAt':-1});
    console.log(email)
    console.log(user)
    return NextResponse.json(user);
  }catch(err){
    console.error('Error fetching images'+err);
    return NextResponse.json({error:err});

  }
}

export const POST = async (request: any) => {
  await connect()
  const { image, aiResponse, email } = await request.json();
  const user = await User.findOne({ email });

  if (user) {
    
   
    console.log(aiResponse);
    let a = 999-composition_score;
    let b = 999-use_of_color_score;
    let c = 999-message_score;
    const averge = (a+b+c)/3;

    const marks = Math.floor((average/999)*8);

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