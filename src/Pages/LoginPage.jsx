import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/headerComponent';
import './page.css';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Login = () => {
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signInUser(loginInfo);
        if (!error) {
            navigate('/calculator'); // Only navigate if there's no error
        }
    };


    return (
        <div className='fullheight md:flex w-100 bg-green-700'>
            <section className='text-center p-10'>
                <Header text={'Sign in'} style={'text-5xl text-white uppercase fw-bolder'} />
                <form onSubmit={handleSubmit} className='py-20'>
                    <div className='flex mt-2'>
                        <label htmlFor="email" className='text-xl pt-2 text-white'>Email:</label>
                        <input
                            type="email"
                            className='rounded p-3'
                            name='email'
                            onChange={handleInput}
                            placeholder='example@example.com'
                            required
                        />
                    </div>
                    <div className='flex mt-2'>
                        <label htmlFor="password" className='text-xl pt-2 text-white'>Password:</label>
                        <input
                            type="password"
                            className='rounded p-3 focus:border-0'
                            name='password'
                            onChange={handleInput}
                            placeholder='********'
                            required
                        />
                    </div>
                    <div className='block mt-4'>
                        <input type="checkbox" className='accent-green-300' name="remember" id="remember" />
                        <label htmlFor="remember" className='text-white text-lg ml-2'>Remember me</label>
                    </div>
                    <button type="submit" className='my-20 p-2 bg-white m-2 rounded-3xl w-3/5 text-1xl font-bold cursor-pointer text-green-700 hover:bg-green-500 hover:text-white active:bg-green-900'>
                        Sign in
                    </button>
                </form>
            </section>
            <div className='bbb h-full hidden md:block'>
                <img src="" alt="Decoration" />
            </div>
        </div>
    );
}

export default Login;
