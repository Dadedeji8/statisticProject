import React from 'react'
// import Calculator from './calculator'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Calculator from './Calculator'
const Home = () => {
    const [switched, setSwitched] = useState('calculator')
    return (
        < div >
            <div className='nav bg-green-900 p-4 text-white'>
                <Link to="/calculator" className='p-5' onClick={() => { setSwitched('calculator') }}>calculator</Link>
                <Link to="/history" className='p-5' onClick={() => { setSwitched('history') }}>History</Link>
            </div>

            {switched == 'calculator' ? <Calculator /> : <Outlet />}
        </div >
    )
}

export default Home