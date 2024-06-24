import React from 'react'
import Header from '../components/headerComponent'
import './page.css'
import '../index.css'

const Login = () => {
    const preventDefault = () => {

    }

    return (
        <div className='fullheight md:flex w-100  bg-green-700'>
            <section className='text-center   p-10'>
                <Header text={'Sign in'} style={'text-5xl text-white uppercase fw-bolder'} />
                <form action="submit" className='py-20'>
                    <div className='flex mt-2'>

                        <label htmlFor="email" className='text-xl  pt-2 text-white'>Email:</label>
                        <input type="email" className='rounded p-3 ' placeholder='example@example.com' />

                    </div>
                    <div className='flex mt-2'>

                        <label htmlFor="email" className='text-xl  pt-2 text-white'>Password:</label>
                        <input type="password" className='rounded p-3 focus:border-0' placeholder='********' />

                    </div>
                    <div className='block'>
                        <input type="checkbox" className='accent-green-300' name="remember" id="" />

                    </div>
                    <input type="button" value="Sign in" className='my-20 p-2 bg-white m-2 rounded-3xl w-3/5 text-1xl text-bolder text-green-700 hover:bg-green-500 hover:text-white h3 active:bg-green-900 ' />
                </form>
            </section>
            <div className='bbb h-full hidden md:block  '>
                <img src="" alt="" />
            </div>
        </div>
    )
}

export default Login