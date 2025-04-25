import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {Appbar} from "../components/AppBar"
import {ProductList} from "../components/ProductList"
import {User} from "../components/User"

export const Home = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [balance, setBalance] = useState(0)
    const [isAdmin ,setIsAdmin] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/user/me",{
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then((res) => {
            setFirstName(res.data.firstName)
            setLastName(res.data.lastName)
            setBalance(res.data.balance)    
            setIsAdmin(res.data.isAdmin)
        })
    }, [])
    return <div>
        <div className="flex flex-col justify-center">
            <div className=""><Appbar /></div>
            <div className="pt-4 flex justify-center"><User firstName={firstName} lastName={lastName} balance={balance} isAdmin={isAdmin}/></div>
            <div className="pt-10"><ProductList /></div>
        </div>
    </div>
}