import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import HistoryCard from '../components/HistoryCard'
const History = () => {
    const [history, setHistory] = useState([]);

    const { token, user } = useContext(AuthContext)
    useEffect(() => { getResultInApi() }, [])
    const getResultInApi = async () => {
        console.log('this is the token passed from AuthContext', token)
        const localJUserData = localStorage.getItem('user')
        const localJUser = JSON.parse(localJUserData)
        console.log('this is the user from local storage', localJUser)
        try {
            const response = await fetch(`https://statcalculatorbackend.vercel.app/history/${user._id}`, {
                method: 'GET',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },


            })

            if (!response.ok) {
                throw new Error(`Failed to store result: ${response.statusText}`);
            }

            const record = await response.json()
            console.log('record has been sucessfully recorded', record)

            setHistory(record.histories
            )
            console.log(
                history
            )
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='p-4 vh-100 bg-green-50'>
            <h2 className="h2 text-3xl text-green-900">History</h2>
            <div className='mt-2 flex gap-5 flex-wrap'>
                {/* <HistoryCard /> */}
                {
                    history?.length === 0 ? <h1>No Records Found</h1> : history.map((record) => {
                        return <HistoryCard key={record._id} Title={record.name} result={record.result} note={record.note} location={record.location} date={record.date} />
                    })
                }
            </div>
        </div>
    )
}

export default History