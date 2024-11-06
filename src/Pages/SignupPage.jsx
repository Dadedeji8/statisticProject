import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/headerComponent'
import './page.css'
import '../index.css'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const Signup = () => {
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });
    const [validateError, setValidateError] = useState("")


    const [loading, setLoading] = useState(false)
    const [hidenPassword, setHidenPassword] = useState(true)
    const { signInUser, error } = useContext(AuthContext);

    useEffect(() => {
        console.log(loginInfo);
    }, [loginInfo]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };
    const validateForm = () => {
        if (!loginInfo.email) {
            validateError("email is required")
            return false
        } else if (!/\S+@\S+\.\S+/.test(loginInfo.email)) {
            setValidateError('Invalid Email')
            return false
        }
        if (!loginInfo.password) {

            setValidateError("Password is required")

            return false
        }
        setValidateError('')
        return true
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true)
                console.log('submitting the documents', loginInfo)
                await signInUser(loginInfo);
                if (!error) {
                    setLoading(true)
                    setLoginInfo({
                        email: '',
                        password: '',
                    })
                    return navigate('/calculator'); // Only navigate if there's no 
                }
                console.log(error)
            } catch (error) {
                console.log(error)
            }
        }
    };

    return (
        <div className='fullheight md:flex w-100  bg-green-700'>
            <section className='text-center   p-10'>
                <Header text={'Sign up'} style={'text-5xl text-white uppercase fw-bolder'} />
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
                    <input type="button" value="Create User" className='my-20 p-2 bg-white m-2 rounded-3xl w-3/5 text-1xl text-bolder text-green-700 hover:bg-green-500 hover:text-white h3 active:bg-green-900 ' />
                </form>
            </section>
            <div className='bbb h-full hidden md:block  '>
                <img src="" alt="" />
            </div>
        </div>
    )
}

export default Signup