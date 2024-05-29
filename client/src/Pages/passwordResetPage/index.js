import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import Axios from "axios";

import Loader from "../../Components/Loader";
import Logo from '../../Assets/Logo.jpg';

const baseURL = "http://localhost:8888/api/";

export default function PasswordReset( props ){

    const Navigate = useNavigate()
    const Location = useLocation()
    console.log(Location.state);

    const [ pageState,setPageState ] = useState({
        isLoading:false,
        isPasswordUpdating:false,
        newPasswordType:"password",
        confirmPasswordType:"password",
        data:""
    });
    
    const [ formData,setFormData ] = useState({
        newPassword: "",
        confirmNewPassword: ""
    });
    
    const [ formDataValidation,setFormDataValidation ] = useState({
        newPassword: null,
        confirmNewPassword: null
    });
    
    const handleChange = (event) =>{
        
        const { name,value } = event.target;
        setFormData( (prev)=>({ ...prev,[name]:value }) );
        setFormDataValidation( (prev)=>({ ...prev,[name]:null }) );
    
    }
    
    const handleValidation = () =>{
    
        let inValid = false;
    
        if(formData.newPassword === ""){
            inValid = true;
            setFormDataValidation( (prev)=>({ ...prev,newPassword:"Please enter password." }) );
        }
        if(formData.confirmNewPassword === ""){
            inValid = true;
            setFormDataValidation( (prev)=>({ ...prev,confirmNewPassword:"Please re-enter password." }) );
        }
        else if(formData.confirmNewPassword !== formData.newPassword){
            inValid = true;
            setFormDataValidation( (prev)=>({ ...prev,confirmNewPassword:"Re-entered password is mismatching" }) );
        }
    
        return inValid;
    }
    
    const updatePassword = ()=>{
    
        setPageState( (prev)=>({...prev,isLoading:true,isPasswordUpdating:true}) );
        Axios.post(`${baseURL}logging/updatePassword`,{email:Location.state.userName,password:formData.confirmNewPassword}).then((response)=>{
            if(response.data.message === "Password Updated"){
                Navigate('/')
            }
            else{
                setFormDataValidation( (prev)=>({ ...prev,confirmNewPassword:"Password Update Failed" }) );
            }
        })
    
    }
    
    const handleSubmit = (event) =>{
    
        event.preventDefault();
    
        if(!handleValidation()){
            updatePassword()
        }
    
    }

    if( pageState.isLoading && !pageState.isPasswordUpdating ){
        return(
            <Loader custom={{height:40,width:40,weight:8}}/>
        )
    }
    else{
        return(
            <div className='flex flex-row gap-10 justify-center items-center h-screen bg-encoredBlack'>
                <div className='basis-1/4 flex flex-col gap-5 justify-center items-center bg-regularBlack h-full rounded-r-xl'>
                    <img className='w-60 h-60' src={Logo} alt="Logo" />
                    <p className='text-4xl text-regularWhite font-bold font-montserrat'>ENCORED</p>
                    <p className='text-xl text-regularWhite font-robot font-light'>Super Portal</p>
                </div>
                <div className='basis-3/4 flex flex-col gap-5 justify-center items-center'>
                    <div className='flex flex-col gap-0 text-center'>
                        <p className='text-2xl text-regularWhite font-robot font-medium'>{`Ahh... It you... ${ Location.state.userName} 😇`}</p>
                        <p className='text-md text-regularWhite font-robot font-thin'>Enter a new password for your SuperPortal</p>
                    </div>
                    <form className='flex flex-col w-[40%] gap-2 text-regularWhite font-robot' onSubmit={ (event)=>{ handleSubmit(event) } }>
                        <div>
                            <p className='font-normal text-xl mb-1'>New Password</p>
                            <div className={`flex bg-encoredGrey align-middle justify-center rounded-md p-1 ${ formDataValidation.newPassword && 'border-[2px]  border-regularRed border-spacing-1'}`}>
                                <input 
                                    className={`w-[100%] bg-encoredGrey text-lg font-thin outline-none rounded-md`} 
                                    type={`${pageState.newPasswordType}`} 
                                    name="newPassword" 
                                    value={formData.userName} 
                                    onChange={ (event)=>{ handleChange(event) } } 
                                />
                                {
                                    (pageState.newPasswordType === "password")?
                                        <button 
                                            type="button"
                                            className=" bg-none outline-none border-0"
                                            onClick={()=>{ setPageState((prev)=>({...prev,newPasswordType:"text"}))}}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                    :
                                        <button 
                                            type="button"
                                            className=" bg-none outline-none border-0"
                                            onClick={()=>{ setPageState((prev)=>({...prev,newPasswordType:"password"}))}}
                                        >
                                            <i className="fa-solid fa-eye-slash"></i>
                                        </button>
                                }
                            </div>
                            <p className={`ext-sm font-extralight text-regularRed ${ formDataValidation.newPassword ? "visible" :"hidden" }`}>{formDataValidation.newPassword}</p>
                        </div>
                        <div>
                            <p className='font-normal text-xl mb-1'>Confirm Password</p>
                            <div className={`flex bg-encoredGrey align-middle justify-center rounded-md p-1 ${ formDataValidation.confirmNewPassword && 'border-[2px]  border-regularRed border-spacing-1'}`}>
                                <input 
                                    className={`w-[100%] bg-encoredGrey outline-none text-lg font-thin rounded-md`} 
                                    type={`${pageState.confirmPasswordType}`} 
                                    name="confirmNewPassword" 
                                    value={formData.confirmNewPassword} 
                                    onChange={ (event)=>{ handleChange(event) } } 
                                />
                                {
                                    (pageState.confirmPasswordType === "password")?
                                        <button 
                                            type="button"
                                            className=" bg-none outline-none border-0"
                                            onClick={()=>{ setPageState((prev)=>({...prev,confirmPasswordType:"text"}))}}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                    :
                                        <button 
                                            type="button"
                                            className=" bg-none outline-none border-0"
                                            onClick={()=>{ setPageState((prev)=>({...prev,confirmPasswordType:"password"}))}}
                                        >
                                            <i className="fa-solid fa-eye-slash"></i>
                                        </button>
                                }
                            </div>
                            <p className={`ext-sm font-extralight text-regularRed ${ formDataValidation.confirmNewPassword ? "visible" :"hidden" }`}>{formDataValidation.confirmNewPassword}</p>
                        </div>
                        {
                            (pageState.isPasswordUpdating)?
                                <div className="flex flex-row justify-center items-center bg-encoredGold rounded-md">
                                    <div className="border-encoredGrey h-7 w-7 animate-spin rounded-full border-4 border-t-regularBlack"></div>
                                    <p className="font-semibold p-1 rounded-md text-regularBlack">Updating...</p>
                                </div>
                            :
                                <div>
                                    <input className='bg-encoredGold font-semibold w-[100%] p-1 rounded-md text-regularBlack' type="submit" value="Update"/>
                                </div>
                        }
                    </form>
                </div>
            </div>
        );
    }

}