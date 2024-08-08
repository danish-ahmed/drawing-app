import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getData() {
  const session = await getServerSession();
  const res = await fetch( `${baseUrl}/api/images?email=${session?.user?.email}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json();
}

async function getBoardData() {
  const session = await getServerSession();
  const res = await fetch( `${baseUrl}/api/board`)
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
  const boardData = await getBoardData(); 
  const lastImage = data.images[data.images.length-1]
  const topFive = data.images.slice(0,5);
  return (
    <div className="container">
      <h1 className="text-5xl max-[500px]:text-2xl mb-2">Drawing Score</h1>
      <div className="row mt-2 mb-2">
        <div className="col col-lg-2 border-solid border-2 mt-2 mb-2">
          <img className="h-auto max-w-full" src={lastImage.imageUri} alt="" />
        </div>
        <div className="col col-lg-2">
          <h3 className="text-5xl max-[500px]:text-2 mt-2 mb-2">Your Drawing Score is: {lastImage.marks} out of 999.</h3>
          {/* <h1 className="text-5xl max-[500px]:text-2 mt-2 mb-2">AI Feedback</h1> */}
          {/* <p>{lastImage.aiFeedback}</p> */}
        </div>
      </div>
      <br />
      <h2 className="text-3xl font-bold dark:text-white mb-5 mt-3">Leader Board</h2>
      <br />
      <table className="" style={{width:'100%',textAlign:'center'}}>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Full Name</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {boardData?.map((data:any, index:number) => {
            return data?.email === session?.user?.email ? (
            <tr className="bg-orange border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={data._id}>
              <th scope="row">
                {index+1}
              </th>
              <th>
                {data?.fname}
              </th>
              <th>
                {data?.score}
              </th>
              <th>Your Score</th>
            </tr>
          ):
          (
            <tr key={data._id}>
              <th scope="row">
                {index+1}
              </th>
              <td>
                {data.fname}
              </td>
              <td>
                {data.score}
              </td>
            </tr>
          )
          })}
        </tbody>
      </table>
      <br />

      <h2 className="text-3xl font-bold dark:text-white mb-5 mt-3">Some of your work</h2>
      <br />
      <table className="table table-dark">
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Score</th>
            <th scope="col">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map((image:any) => (
            <tr key={image._id}>
              <td>
                <img style={{border:'1px solid #ccc'}} className="card-img-top" src={image.imageUri} alt="Card image cap " />
              </td>
              <td>
                Marks: {image.marks} out of 999
              </td>
              <td>{image.aiFeedback.substr(0,100)} ...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     
  );
}

export default Profile;
