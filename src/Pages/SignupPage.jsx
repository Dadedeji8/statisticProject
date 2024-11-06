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
            <section className='text-center  flex-1 p-10'>
                <Header text={'Sign up'} style={'text-5xl text-white uppercase fw-bolder'} />
                <form action="submit" onSubmit={handleSubmit} className="pt-16 w-full max-w-md mx-auto flex flex-col items-center  rounded-lg ">
                    <h1 className="text-red-600 mb-4 text-center">{validateError}</h1>
                    <div className="flex flex-col w-4/5 mt-4">

                        <label className='text-xl  pt-2 text-white'>Email:</label>
                        <input type="email" className='rounded p-3 focus:outline-none  focus:ring-2 focus:ring-green-400' name='email' onChange={handleInput} placeholder='example@example.com' />

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
                    <div className="flex flex-col w-4/5 mt-4">
                        <label htmlFor="password" className="text-lg font-semibold mb-1 text-white">Re-Enter Password</label>
                        <div className="relative flex items-center rounded bg-white">
                            <input
                                type={hidenPassword ? "password" : "text"}
                                name="repassword"
                                onChange={handleInput}
                                placeholder="Re-enter Password"
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
                        className="my-6 py-2 w-4/5 bg-white rounded text-xl text-green-700 hover:bg-green-500 hover:text-white transition duration-200"
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
                    <div className='mt-2'>
                        Already have an Account     <Link to={'/login'} className='text-white'>Sign in Now</Link>
                    </div>
                </form>

            </section>
            <div className='bbb h-full hidden md:block flex-1 '>
                <img src="" alt="" />
            </div>
        </div>
    )
}

export default Signup