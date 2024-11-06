import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/headerComponent';
import './page.css';
import '../index.css';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className='fullheight md:flex  bg-green-700'>
            <section className='text-center p-10 flex-1'>
                <Header text={'Sign in'} style={'text-5xl text-white uppercase fw-bolder'} />
                <form onSubmit={handleSubmit} className="py-16 w-full max-w-md mx-auto flex flex-col items-center  rounded-lg ">
                    <h1 className="text-red-600 mb-4 text-center">
                        {validateError && validateError}
                    </h1>

                    <div className="flex flex-col w-4/5 mt-4">
                        <label htmlFor="email" className="text-lg font-semibold mb-1 text-white">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleInput}
                            placeholder="example@example.com"
                            required
                            className="rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <div className="flex flex-col w-4/5 mt-4">
                        <label htmlFor="password" className="text-lg font-semibold mb-1 text-white">Password</label>
                        <div className="relative flex items-center rounded bg-white">
                            <input
                                type={hidenPassword ? "password" : "text"}
                                name="password"
                                onChange={handleInput}
                                placeholder="********"
                                required
                                className="rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            <div className="absolute right-3 cursor-pointer text-green-600" onClick={() => setHidenPassword(!hidenPassword)}>
                                {hidenPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 py-2  w-4/5 bg-white flex justify-center gap-3 rounded text-xl text-green-700 hover:bg-green-500 hover:text-white transition duration-200"
                    >
                        {!loading ? (
                            "Sign in"
                        ) : (
                            <span className="flex items-center space-x-2">
                                <CgSpinner className="animate-spin" />
                                <span>Loading</span>
                            </span>
                        )}
                    </button>

                    <div className="mt-4 text-white">
                        New here?{' '}
                        <Link to="/signup" className="font-semibold underline text-white hover:text-orange-600">
                            Sign Up Now
                        </Link>
                    </div>
                </form>
            </section>
            <div className='bbb flex-1 h-full hidden md:block'>

            </div>
        </div>
    );
}

export default Login;
