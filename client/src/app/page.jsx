'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FlashCardCard from '@/components/LandingPageCards/FlashCardCard'
import MainCard from '@/components/LandingPageCards/MainCard'
import SummarizeCard from '@/components/LandingPageCards/SummarizeCard'
import Link from 'next/link'
import React from 'react'

const LandingPage = () => {
  const router = useRouter();

  const { isAuthenticated, loading } = useAuth(); // Get auth status

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard'); // Redirect to dashboard if logged in
    }
  }, [loading, isAuthenticated]);

  if (loading) return <p>Loading...</p>; // Show a loading state while checking auth
  
  return (
    <div>
      <div className='text-center bg-gradient-to-b from-white to-slate-300 dark:from-gray-900 dark:to-gray-700 flex justify-center mt-20 mb-32'>
        <div className='text-center'>
          <h1 className='sm:text-[64px] text-4xl font-bold w-2/3 mx-auto sm:leading-[1.2]'>Revolutionize Your Study Sessions with AI</h1>
          <Link href="/register">
            <button className='bg-gray-900 dark:bg-gray-600 text-white text-lg py-2 px-3 rounded-lg mt-5'>Get Started</button>
          </Link>
          <MainCard />
        </div>  
      </div>
      <h1 className='text-center text-4xl font-bold pt-16'>Enhance Your Learning Experience</h1>
      <div className='sm:w-3/5 w-5/6 mx-auto mt-8 flex justify-between gap-x-10 gap-y-10 flex-col sm:flex-row'>
        <SummarizeCard />
        <FlashCardCard />
      </div>
    </div>
  )
}

export default LandingPage
