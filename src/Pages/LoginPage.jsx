import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/headerComponent';
import './page.css';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';

const Login = () => {
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
        <div className='fullheight md:flex w-100 bg-green-700'>
            <section className='text-center p-10'>
                <Header text={'Sign in'} style={'text-5xl text-white uppercase fw-bolder'} />
                <form onSubmit={handleSubmit} className='py-20'>
                    <h1 className='text-red-600'>
                        {
                            validateError
                        }
                    </h1>

                    <div className='flex mt-2'>
                        <label htmlFor="email" className='text-xl pt-2 text-white'>Email:</label>
                        <input
                            type="email"
                            className='rounded p-3'
                            name='email'
                            value={loginInfo.email}
                            onChange={handleInput}
                            placeholder='example@example.com'
                            required
                        />

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

                    <button type="submit" className='my-20 p-2 bg-white m-2 rounded-3xl w-3/5 text-1xl font-bold cursor-pointer text-green-700 hover:bg-green-500 hover:text-white active:bg-green-900'>
                        {!loading ? "Sign in" : <span className=' items-center justify-around'> <CgSpinner className=' rotate-45 animate-spin  ' /> <span>Loading</span></span>}
                    </button>
                </form>
            </section>
            <div className='bbb h-full hidden md:block'>

            </div>
        </div>
    );
}

export default Login;
