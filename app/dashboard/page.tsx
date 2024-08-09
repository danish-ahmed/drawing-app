import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Canvas from '@/components/canvas'

const Dashboard = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  return (
    <div className="container">
      <h1 className="text-4xl max-[500px]:text-2xl mb-5 mt-3 text-center">Dashboard</h1>
      <Canvas/>
    </div>
  );
};

export default Dashboard;
