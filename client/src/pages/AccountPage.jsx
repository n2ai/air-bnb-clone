import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate,Link, useParams } from "react-router-dom";
import axios from "axios";

export default function AccountPage(){
    const [redirect, setRedirect] = useState(null)
    const {ready,user, setUser} = useContext(UserContext);
    let {subpage} = useParams();
    if(subpage === undefined){
        subpage = 'profile'
    }

    async function logout(){
        await axios.post('/logout')
        setUser(null)
        setRedirect('/')
    }

    if(!ready){
        return 'Loading...'
    }

    if(!user && ready && !redirect){
        return <Navigate to={'/login'} />
    }

    function LinkClasses (type = null){
        let classes = 'py-2 px-6'
        
        if (type===subpage){
            classes += 'bg-primary text-white rounded-full';
        }
        return classes
    }   

    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(
        
        <div>
            <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
                <Link className={LinkClasses('profile')} to={'/account'}>My profile</Link>
                <Link className={LinkClasses('bookings')} to={'/account/bookings'}>My Bookings</Link>
                <Link className={LinkClasses('places')} to={'/account/places'}>My accommodations</Link>
            </nav>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})
                    <button onClick={logout} className="primary m-w-sm mt-2">Logout</button>
                </div>

            )}
        </div>
    )
}