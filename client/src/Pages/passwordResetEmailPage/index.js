import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import Loader from "../../Components/Loader";
import Logo from '../../Assets/Logo.jpg';

const baseURL = "http://localhost:8888/api/";

export default function PasswordResetEmail(){

    const Navigate = useNavigate()

    const [ pageState,setPageState ] = useState({
        isLoading:false,
        isOtpSending:false,
        isOtpSent:false,
        data:""
    });

    const [ formData,setFormData ] = useState({
        userName: "",
        otp: ""
    });

    const [ formDataValidation,setFormDataValidation ] = useState({
        userName: null,
        otp: null
    });

    const handleChange = (event) =>{
        
        const { name,value } = event.target;
        setFormData( (prev)=>({ ...prev,[name]:value }) );
        setFormDataValidation( (prev)=>({ ...prev,[name]:null }) );

    }

    const handleValidation = () =>{

        let inValid = false;

        if(formData.userName === ""){
            inValid = true;
            setFormDataValidation( (prev)=>({ ...prev,userName:"Please enter username." }) );
        }
        if(formData.otp === "" && pageState.isOtpSent){
            inValid = true;
            setFormDataValidation( (prev)=>({ ...prev,otp:"Please enter OTP." }) );
        }

        return inValid;
    }

    const sendOtp = ()=>{

        setPageState( (prev)=>({...prev,isLoading:true,isOtpSending:true}) );
        Axios.post(`${baseURL}logging/getUser`,{ userEmail:formData.userName }).then((response)=>{
            if(response.data.data === undefined){
                setFormDataValidation( (prev)=>({ ...prev,userName:"Username not found" }) );
                setPageState( (prev)=>({...prev,isLoading:false,isOtpSent:false,isOtpSending:false}) );
            }
            else{
                Axios.post(`${baseURL}logging/sendOtp`, { userMail: formData.userName,userName: response.data.data[0].firstname }).then((res)=>{
                    setPageState( (prev)=>({...prev,isLoading:false,isOtpSent:true,isOtpSending:false,data:{otp:res.data.otp}}) );
                });
            }
        });

    }

    const handleEmailSubmit = (event) =>{

        event.preventDefault();

        if(!handleValidation()){
            sendOtp()
        }

    }

    const handleOtpSubmit = (event) =>{

        event.preventDefault();

        if(!handleValidation()){
            if( formData.otp === String(pageState.data.otp) ){
                Navigate('/UpdatePassword', {state:{userName: formData.userName }})
            }
            else{
                setFormDataValidation( (prev)=>({ ...prev,otp:"OTP mismatch" }) );
            }
        }

    }

    if( pageState.isLoading && !pageState.isOtpSending ){
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
                        <p className='text-2xl text-regularWhite font-robot font-medium'>Who Are You ? 🤨</p>
                        <p className='text-md text-regularWhite font-robot font-thin'>Verify yourself with OTP</p>
                    </div>
                    <form className='flex flex-col w-[40%] gap-2 text-regularWhite font-robot' onSubmit={ (event)=>{ (pageState.isOtpSent)?handleOtpSubmit(event):handleEmailSubmit(event) } }>
                        <div>
                            <p className='font-normal text-xl mb-1'>Username</p>
                            <input disabled={pageState.isOtpSent} className={`w-[100%] bg-encoredGrey outline-none text-lg font-thin p-1 rounded-md ${ formDataValidation.userName && 'border-[2px]  border-regularRed border-spacing-1'}`} type="email" name="userName" value={formData.userName} onChange={ (event)=>{ handleChange(event) } } />
                            <p className={`ext-sm font-extralight text-regularRed ${ formDataValidation.userName ? "visible" :"hidden" }`}>{formDataValidation.userName}</p>
                        </div>
                        {
                            (pageState.isOtpSent)?
                                <>
                                    <div>
                                        <p className='font-normal text-xl mb-1'>OTP</p>
                                        <input className={`w-[100%] bg-encoredGrey outline-none text-lg font-thin p-1 rounded-md ${ formDataValidation.passWord && 'border-[2px]  border-regularRed border-spacing-1'}`} type="text" name="otp" value={formData.otp} onChange={ (event)=>{ handleChange(event) } } />
                                        <p className={`ext-sm font-extralight text-regularRed ${ formDataValidation.otp ? "visible" :"hidden" }`}>{formDataValidation.otp}</p>
                                    </div>
                                    <div className='flex justify-center my-3'>
                                        <p className='text-sm font-robot font-extralight text-regularRed text-center w-fit'>Do check in Spam also</p>
                                    </div>
                                </>
                            :<></>
                        }
                        {
                            (pageState.isOtpSending)?
                                <div className="flex flex-row justify-center items-center bg-encoredGold rounded-md">
                                    <div className="border-encoredGrey h-7 w-7 animate-spin rounded-full border-4 border-t-regularBlack"></div>
                                    <p className="font-semibold p-1 rounded-md text-regularBlack">Sending...</p>
                                </div>
                            :
                                <div>
                                    <input className='bg-encoredGold font-semibold w-[100%] p-1 rounded-md text-regularBlack' type="submit" value={(pageState.isOtpSent)?"Verify":"Send Otp"}/>
                                </div>
                        }
                    </form>
                </div>
            </div>
        )
    }
}