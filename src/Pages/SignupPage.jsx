import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/headerComponent'
import './page.css'
import '../index.css'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { CgSpinner } from 'react-icons/cg'

const Signup = () => {
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });
    const [repassword, setRePassword] = useState('')
    const [validateError, setValidateError] = useState("")
    const [loading, setLoading] = useState(false)
    const [hidenPassword, setHidenPassword] = useState(true)
    const { registerUser, error } = useContext(AuthContext);

    useEffect(() => {
        console.log(loginInfo);
        console.log(repassword)
    }, [loginInfo, repassword]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setLoginInfo({
            ...loginInfo,
            [name]: value,
        });
    };
    const handleRepeatPassword = (e) => {
        setRePassword(
            e.target.value
        )
    }
    const validateForm = () => {
        if (!loginInfo.email) {
            setValidateError("email is required")
            return false
        } else if (!/\S+@\S+\.\S+/.test(loginInfo.email)) {
            setValidateError('Invalid Email')
            return false
        }
        if (!loginInfo.password) {

            setValidateError("Password is required")

            return false
        } else
            if (loginInfo.password !== repassword) {
                setValidateError("Passwords don't match")

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
                await registerUser(loginInfo);
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
                <form action="submit" onSubmit={handleSubmit} className='py-20'>
                    <h1 className='text-red-600'>{validateError}</h1>
                    <div className='flex mt-2'>

                        <label className='text-xl  pt-2 text-white'>Email:</label>
                        <input type="email" className='rounded p-3 ' name='email' onChange={handleInput} placeholder='example@example.com' />

                    </div>
                    <div className='flex mt-2'>
                        <label htmlFor="password" className='text-xl pt-2 text-white'>Password:</label>
                        <div className=' flex rounded p-3 pr-1 focus:border-0 items-center justify-center bg-white'>
                            <input
                                type={hidenPassword ? "password" : "text"}
                                className='rounded focus:border-0'
                                name='password'
                                value={loginInfo.password}
                                onChange={handleInput}
                                placeholder='********'
                                required
                            />
                            {hidenPassword ? <FaEyeSlash onClick={() => { setHidenPassword(!hidenPassword) }} /> : <FaEye onClick={() => { setHidenPassword(!hidenPassword) }} />}
                        </div>

                    </div>
                    <div className='flex mt-2'>
                        <label htmlFor="password" className='text-xl pt-2 text-white'>Re-enter Password:</label>
                        <div className=' flex rounded p-3 pr-1 focus:border-0 items-center justify-center bg-white'>
                            <input
                                type={hidenPassword ? "password" : "text"}
                                className='rounded focus:border-0'
                                name='rePassword'
                                value={repassword}
                                onChange={handleRepeatPassword}
                                placeholder='re-enter password'
                                required
                            />
                            {hidenPassword ? <FaEyeSlash onClick={() => { setHidenPassword(!hidenPassword) }} /> : <FaEye onClick={() => { setHidenPassword(!hidenPassword) }} />}
                        </div>

                    </div>
                    <div className='block'>
                        <input type="checkbox" className='accent-green-300' name="remember" id="" />

                    </div>
                    <button type="submit" className='my-20 p-2 bg-white m-2 rounded-3xl w-3/5 text-1xl font-bold cursor-pointer text-green-700 hover:bg-green-500 hover:text-white active:bg-green-900'>
                        {!loading ? "Sign up" : <span className=' items-center justify-around'> <CgSpinner className=' rotate-45 animate-spin  ' /> <span>Loading</span></span>}
                    </button>
                    <div className='mt-2'>
                        Already have an Account     <Link to={'/login'} className='text-white'>Sign in Now</Link>
                    </div>
                </form>

            </section>
            <div className='bbb h-full hidden md:block  '>
                <img src="" alt="" />
            </div>
        </div>
    )
}

export default Signup