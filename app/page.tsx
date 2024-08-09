"use client";
import React, { useState } from "react";
// import {useSession } from 'nex-auth/react';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");

  // const session = useSession();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async(e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }
    router.push(`/register?email=${encodeURIComponent(email)}`)
  }
  
  return (
      
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 space-y-6" >        
          <h1 className="text-5xl max-[500px]:text-2xl text-center">World Art Rating</h1>
        </div>
        <div className="bg-slate-300 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full border border-black justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-black bg-yellow-400 hover:bg-yellow-500 shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Artist Registration Form
              </button>
            </div>
          </form>
          <div className="text-sm leading-6">
            <Link
              href="/login"
              className="text-black hover:text-gray-900"
            >
              I already have an account.
            </Link>
          </div>
        </div>
      </div>
                
  );
}
