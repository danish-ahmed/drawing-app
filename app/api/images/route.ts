import User from "@/models/User";
// import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connect from "@/utils/db";

export const GET = async (request: any) => {
  await connect()
  const email = decodeURIComponent(request.url.split('?')[1].split('=')[1]);
  console.log(email)
  try{
    const user = await User.findOne({ email:email }).sort({'images.createdAt':-1});
    
    return NextResponse.json(user);
  }catch(err){
    console.error('Error fetching images'+err);
    return NextResponse.json({error:err});

  }
}

function countDigits(number: number) {
    return number.toString().length;
}

export const POST = async (request: any) => {
  await connect()
  const { image, aiResponse, email } = await request.json();
  const user = await User.findOne({ email });

  if (user) {
    
   
    // console.log(aiResponse);
    let ax = aiResponse.composition_score;
    let bx = aiResponse.use_of_color_score;
    let cx = aiResponse.message_score;

    let a = 999-ax;
    let b = 999-bx;
    let c = 999-cx;
    // const average_score = (a+b+c)/3;

    const y = Math.floor((((a+b+c)/3)/999)*8);

    const bn = b*(10 ** countDigits(c));
    console.log('bn',bn)
    const an = a*(10 ** (countDigits(b) + countDigits(c)));
    console.log('an',an)
    const yn = y*(10 ** (countDigits(a) + countDigits(b) + countDigits(c)))
    console.log('yn',yn)
    const marks = c + bn + an + yn;
    console.log('marks',marks)
    
    const imageObj = {
      imageUri:image,
      aiFeedback:JSON.stringify(aiResponse),
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