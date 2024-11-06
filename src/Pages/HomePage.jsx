import React from 'react'
// import Calculator from './calculator'
import { useState, useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Calculator from './Calculator'
import { AuthContext } from '../context/authContext'

const Home = () => {
    const [switched, setSwitched] = useState('calculator')
    const { logOut } = useContext(AuthContext)

    return (
        < div >
            <div className='nav flex justify-between items-center bg-green-900 p-4 text-white'>
                <div>     <Link to="/calculator" className='p-5 hover:text-yellow-600' onClick={() => { setSwitched('calculator') }}>calculator</Link>
                    <Link to="/history" className='p-5 hover:text-yellow-600' onClick={() => { setSwitched('history') }}>Records</Link></div>
                <Link to="/login" className='p-5 hover:text-yellow-600' onClick={() => { setSwitched('history'); logOut() }
                }>Log Out</Link>
            </div>

            {switched == 'calculator' ? <Calculator /> : <Outlet />}
        </div >
    )
}

export default Home