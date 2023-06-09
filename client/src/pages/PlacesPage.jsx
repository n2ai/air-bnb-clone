import { useState } from "react";
import { Link, useParams } from "react-router-dom"
import Perks from "../Perks";
import axios from "axios";
import { response } from "express";
export default function PlacesPage(){
    const {action} = useParams();
    const [title,setTitle] = useState();
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);

    function inputHeader(text){
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text){
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header,description){
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        
        data.set('photos[]',files)
        
        data.set('photos', files);
        axios.post('/upload', data, {
            headers:{'Content-Type':'multipart/form-data'}
        }).then(response =>{
            const {data:filename} = response;
            setAddedPhotos(prev=>{
                return[...prev, filename];
            });
        })
    }

    async function addPhotoByLink(ev){
        ev.preventDefault()
        const {data:filename} =  await axios.post('/upload-by-link', {link:photoLink})
        setAddedPhotos(prev=>{
            return[...prev, filename];
        });
        setPhotoLink('')
    }

    return(
        <div>
            {action !== 'new' && (
                <div className="text-center">
                    <Link className=" inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new places
                    </Link>
                </div>
            )}
            {action == 'new' &&(
                <div>
                    <form>
                        {preInput('Title','title for your place, should be short and catchy as in advertisement')}
                        <input type="text" value={title} onChange={ev=> ev.target.value} placeholder="title, for example: My lovely apt"></input>
                        {preInput('Address','Address to this place' )}
                        <input type="text"  placeholder="address"></input>
                        {preInput('Photos', 'More = better')}
                        <div className="flex gap-2">
                            <input value={photoLink} 
                                   onChange={ev => setPhotoLink(ev.target.value)} 
                                   type="text" placeholder={'Add using a link....jpg'} />
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp; photo</button>
                        </div>
                        
                        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {addedPhotos.length>0 && addedPhotos.map(link => (
                                <div key={link[1]}>
                                    <img className="rounded-2xl" src={'http://localhost:4000/uploads/'+link}></img>
                                </div>
                            ))}
                            <label className="cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                                <input type="file" className="hidden" onChange={uploadPhoto}></input>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>
                                Upload
                            </label>
                        </div>
                        {preInput('Description', 'description of the place')}
                        <textarea value={description} onChange={ev=>setDescription(ev.target.value)}></textarea>
                        {preInput('Perks', 'Select all the perks of the place')}
                        <div className="mt-2 gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            <Perks selected={perks} onChange={setPerks} />
                        </div>
                        {preInput('Extra info','house rules, etc')}
                        <textarea value={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)}></textarea>
                        {preInput('Check in&out times. max guest','add check in and out times, remember to have some time window for cleaning the room between guests')}
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1">Check in time</h3>
                                <input type="text" placeholder="14" 
                                       value={checkIn} 
                                       onChange={ev=>setCheckIn(ev.target.value)}></input>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Check out time</h3>
                                <input type="text" placeholder="11" 
                                       value={checkOut} 
                                       onChange={ev=>setCheckOut(ev.target.value)} ></input>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                                <input type="number" 
                                       value={maxGuests} 
                                       onChange={ev=>setMaxGuests(ev.target.value)}></input>
                            </div>
                        </div>
                        <div>
                            <button className="primary my-4">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}