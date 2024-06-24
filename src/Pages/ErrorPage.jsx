import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
    return (
        <div>
            <h3 className='text-red-700 text-5xl '>
                Error page not found
            </h3>
            <Link to={"/"} className='text-pretty text-blue-700 underline'>
                go home
            </Link>

        </div>
    )
}

export default Error