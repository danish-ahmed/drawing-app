import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function getData() {
  const session = await getServerSession();
  // console.log(`Fetching data from ${baseUrl}/api/images?email=${session?.user?.email}`)
  const res = await fetch( `${baseUrl}/api/images?email=${session?.user?.email}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json();
}


const Profile = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  const data = await getData(); 
  // const boardData = await getBoardData(); 
  const lastImage = data.images[data.images.length-1]
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h1 className="text-5xl max-[500px]:text-2xl mb-5 text-center">Your World Art Rating</h1>
      <h2 className="text-3xl font-bold mb-5 mt-3 text-center text-red-500">{lastImage.marks.toLocaleString()}</h2>

      <div className="row mt-2 mb-2">
        <div className="col col-lg-2 border-solid border-2 mt-2 mb-2">
          <img className="h-auto max-w-full" src={lastImage.imageUri} alt="" />
        </div>
        <div className="col col-lg-2">
          
        </div>
      </div>
      <br />
      
    </div>
     
  );
}

export default Profile;
