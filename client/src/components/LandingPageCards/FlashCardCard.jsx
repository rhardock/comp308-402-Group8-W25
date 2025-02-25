import React from 'react'

const FlashCardCard = () => {
  return (
    <div className="mb-24 min-h-[370px] border-2 border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 flex-1 relative">
      <h1 className="text-2xl ml-3 mt-3 border-b-2 w-2/3 font-bold">
        Flash Cards For Memory
      </h1>
      <div className=" absolute bottom-0 right-0 w-2/3 border-2 border-b-0 border-r-0 border-gray-300 dark:border-gray-600 rounded-tl-lg bg-white dark:bg-gray-900 ml-auto mt-8 pl-4 pt-4 flex flex-col h-64">
        <h1 className="text-xl mb-2">Customizable</h1>
        <div className="flex justify-between flex-1">
          <div className="w-1/2">
            <div className="h-7 bg-gray-300 dark:bg-gray-800 rounded mb-4"></div>
            <div className="h-7 bg-gray-300 dark:bg-gray-800 rounded mb-4"></div>
            <div className="h-7 bg-gray-300 dark:bg-gray-800 rounded mb-4"></div>
            <div className="h-7 bg-gray-300 dark:bg-gray-800 rounded mb-4"></div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-800 w-24 h-full"></div>
        </div>
      </div>
    </div>
  )
}

export default FlashCardCard
