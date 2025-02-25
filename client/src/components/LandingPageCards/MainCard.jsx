import Link from 'next/link'
import React from 'react'

const MainCard = () => {
  return (
    <div className='sm:w-2/3 w-5/6 border-2 border-gray-400 dark:border-gray-600 rounded-lg mx-auto bg-white dark:bg-gray-900 relative top-32 '>
      <div className='flex justify-between'>
        <p className='text-2xl font-bold ml-5 mt-4'>Noted!</p>
        <Link href="/register">
            <button className='mr-3 bg-gray-900 dark:bg-gray-600 text-white px-3 py-1 rounded-lg my-1 mt-4'>Try Noted Now!</button>
        </Link>
      </div>
      <div className='flex'>
        <div className='w-1/5 mt-2'>
            <div className='bg-gray-200 dark:bg-gray-800 h-8 mx-2 my-2 rounded-lg'></div>
            <div className='bg-gray-200 dark:bg-gray-800 h-8 mx-2 my-2 rounded-lg'></div>
            <div className='bg-gray-200 dark:bg-gray-800 h-8 mx-2 my-2 rounded-lg'></div>
            <div className='bg-gray-200 dark:bg-gray-800 h-8 mx-2 my-2 rounded-lg'></div>
            <div className='bg-gray-200 dark:bg-gray-800 h-8 mx-2 my-2 rounded-lg'></div>
            
        </div>
        <div className='w-4/5 m-3 mt-4 h-[450px] bg-gray-200 dark:bg-gray-800 rounded-lg text-red-600'>
        [Cards to be updated (I assume) with actual dashboard/summary/flashcard UI once they are finalized]
        </div>
      </div>
    </div>
  )
}

export default MainCard
