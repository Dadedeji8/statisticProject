import React from 'react'
import { BiSend } from 'react-icons/bi'
import { PiGps } from 'react-icons/pi'

const HistoryCard = ({ Title = 'Name', result = "result", location = 'location', note = 'brief note', values = [], resultId = '', date = 'time' }) => {
    return (
        <div className='bg-white p-5 rounded-2xl my-1 tracking leading-8'>
            <div className='flex items-center gap-1 justify-between'>
                <h1 className='text-green-950 text-xl font-bold'>
                    {Title}
                </h1>
                <p className='text-green-950 font-bold font-sans'>
                    <span className='text-green-500'>Date calculated: </span> {date}
                </p>
            </div>
            <p className='text-green-950 font-bold font-sans'>
                <span className='text-green-500'>result : </span> {result}
            </p>
            <p className=' text-gray-500 font-thin font-sans'>
                <span className='text-black underline'>NOTE</span >  :  {note}
            </p>
            <p className='text-green-950 font-bold font-sans flex items-center gap-1  '>
                <PiGps className='font-semibold m-0 p-0 text-green-600' />   <span className='text-black'>location : </span> {location}
            </p>
            <p className='text-green-950 font-bold font-sans flex items-center gap-1  '>
                <span className='text-black'>Values : </span> {JSON.stringify(values)}
            </p>
            <button className='share text-white bg-green-900 w-full rounded-xl flex items-center p-3 gap-4 justify-center hover:bg-green-700'>
                <BiSend /> share
            </button>




        </div>
    )
}

export default HistoryCard
