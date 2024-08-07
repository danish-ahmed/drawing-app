import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getData() {
  const session = await getServerSession();
  const res = await fetch( `http://localhost:3000/api/images?email=${session?.user?.email}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json();
}

async function getBoardData() {
  const session = await getServerSession();
  const res = await fetch( `http://localhost:3000/api/board`)
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
      <h1 className="text-5xl max-[500px]:text-2xl">Image Score</h1>
      <div className="row">
        <div className="col col-lg-2">
          <img className="h-auto max-w-full" src={lastImage.imageUri} alt="" />
        </div>
        <div className="col col-lg-2">
          <h3 className="text-5xl max-[500px]:text-2">Your Drawing Score is: {lastImage.marks} out of 999.</h3>
          <h1 className="text-5xl max-[500px]:text-2">AI Feedback</h1>
          <p>{lastImage.aiFeedback}</p>
        </div>
      </div>
      <h2>Your all work</h2>

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

      <h2>Leader Board</h2>
      <table className="table table-dark" style={{width:'100%',textAlign:'center'}}>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Full Name</th>
            <th scope="col">Score</th>
            <th scope="col">Matches</th>
          </tr>
        </thead>
        <tbody>
          {boardData.map((data:any, index:number) => (
            <tr key={data._id}>
              <th scope="row">
                {index+1}
              </th>
              <td>
                {data.fname}
              </td>
              <td>
                {data.average}
              </td>
              <td>{data.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     
  );
}

export default Profile;
