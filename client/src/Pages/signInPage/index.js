import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

import Loader from '../../Components/Loader';
import Logo from '../../Assets/Logo.jpg';

const baseURL = "http://localhost:8888/api/";

function SignIn() {

    const Navigate = useNavigate();

    const [ pageState,setPageState ] = useState({
        isLoading:false,
        isAuthorised:false,
        isScreened:true,
        isChecking:false,
        passwordType:"password",
        data:""
    });

    const [ formData,setFormData ] = useState({
        userName: "",
        passWord: ""
    });

    const [ formDataValidation,setFormDataValidation ] = useState({
        userName: null,
        passWord: null
    });

    useEffect(() => {
        function handleWindowResize() {
          const { innerWidth,innerHeight } = getWindowSize();
          if(innerWidth < 1200){
            setPageState( (prev)=>({...prev,isScreened:false}) );
          }
          else{
            setPageState( (prev)=>({...prev,isScreened:true}) );
          }
        }
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);

    const loginUser = async() =>{
        setPageState( (prev)=>({...prev,isLoading:true,isChecking:true}) );
        setFormDataValidation( (prev)=>({ ...prev,userName:null,passWord:null }) );
        Axios.post(`${baseURL}logging/loginUser`, { userName: formData.userName, passWord: formData.passWord }, {withCredentials: true}).then( (response) =>{
            if(response.data.errorCode === undefined){
                localStorage.setItem("loggedUser",JSON.stringify(response.data.data));
                Navigate('/Dashboard');
                setPageState( (prev)=>({...prev,isLoading:false,isChecking:false}) );
            }
            else if(response.data.errorCode === 401){
                setFormDataValidation( (prev)=>({ ...prev,userName:"User not found." }) );
                setPageState( (prev)=>({...prev,isLoading:false,isChecking:false}) );
            }
            else if(response.data.errorCode === 402){
                setFormDataValidation( (prev)=>({ ...prev,userName:"User not active." }) );
                setPageState( (prev)=>({...prev,isLoading:false,isChecking:false}) );
            }
            else if(response.data.errorCode === 403){
                setFormDataValidation( (prev)=>({ ...prev,passWord:"Incorret password." }) );
                setPageState( (prev)=>({...prev,isLoading:false,isChecking:false}) );
            }
        } );
    };

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
        if(formData.passWord === ""){
            inValid = true;
            setFormDataValidation( (prev)=>({ ...prev,passWord:"Please enter passWord." }) );
        }

        return inValid;
    }

    const handleSubmit = (event) =>{

        event.preventDefault();

        if(!handleValidation()){
            loginUser()
        }

    }

    useEffect( ()=>{
       
        setPageState( (prev)=>({...prev,isLoading:true}) );
        Axios.get(`${baseURL}logging/cookieVerifier`, {withCredentials: true}).then( (response)=>{
            console.log(response.data);
            if(response.data.errorCode !== undefined){
                setPageState( (prev)=>({...prev,isAuthorised:false}) );
                setPageState( (prev)=>({...prev,isLoading:false}) );
            }
            else{
                localStorage.setItem("loggedUser",JSON.stringify(response.data.data));
                setPageState( (prev)=>({...prev,isLoading:true}) );
                Navigate('/Dashboard');
            }
        } );

    },[] );

    if( pageState.isLoading && !pageState.isChecking ){
        return(
            <Loader custom={ {height: 40,width:40,weight:8} }/>
        )
    }
    else if( !pageState.isScreened ){
        return(
            <div className='flex flex-col gap-2 justify-center items-center h-screen bg-regularBlack'>
                <img className='w-60 h-60' src={Logo} alt="Logo" />
                <p className='text-4xl text-regularWhite font-bold font-montserrat mb-5'>ENCORED</p>
                <p className='text-2xl text-regularWhite font-robot font-normal'>Site not Accessible</p>
                <p className='text-xl text-regularWhite font-robot font-thin'>We recommend you to use a Laptop/Desktop</p>
            </div>
        )
    }
    else if( !pageState.isAuthorised ){
        return (
            <div className='flex flex-row gap-10 justify-center items-center h-screen bg-encoredBlack'>
                <div className='basis-1/4 flex flex-col gap-5 justify-center items-center bg-regularBlack h-full rounded-r-xl'>
                    <img className='w-60 h-60' src={Logo} alt="Logo" />
                    <p className='text-4xl text-regularWhite font-bold font-montserrat'>ENCORED</p>
                    <p className='text-xl text-regularWhite font-robot font-light'>Super Portal</p>
                </div>
                <div className='basis-3/4 flex flex-col gap-5 justify-center items-center'>
                    <div className='flex flex-col gap-0 text-center'>
                        <p className='text-2xl text-regularWhite font-robot font-medium'>Welcome Back!! 👋</p>
                        <p className='text-md text-regularWhite font-robot font-thin'>You'er Missed</p>
                    </div>
                    <div className='flex flex-col'></div>
                    <form className='flex flex-col w-[40%] gap-2 text-regularWhite font-robot' onSubmit={ (event)=>{ handleSubmit(event) } }>
                        <div>
                            <p className='font-normal text-xl mb-1'>Username</p>
                            <input className={`w-[100%] bg-encoredGrey text-lg font-thin p-1 rounded-md ${ formDataValidation.userName && 'border-[2px]  border-regularRed border-spacing-1'}`} type="email" name="userName" value={formData.userName} onChange={ (event)=>{ handleChange(event) } } />
                            <p className={`ext-sm font-extralight text-regularRed ${ formDataValidation.userName ? "visible" :"hidden" }`}>{formDataValidation.userName}</p>
                        </div>
                        <div>
                            <p className='font-normal text-xl mb-1'>Password</p>
                            <div className={`flex bg-encoredGrey align-middle justify-center rounded-md p-1 ${ formDataValidation.passWord && 'border-[2px]  border-regularRed border-spacing-1'}`}>
                                <input 
                                    className={`w-[100%] bg-encoredGrey outline-none text-lg font-thin rounded-md`} 
                                    type={`${pageState.passwordType}`} 
                                    name="passWord" 
                                    value={formData.passWord} 
                                    onChange={ (event)=>{ handleChange(event) } } 
                                />
                                {
                                    (pageState.passwordType === "password")?
                                        <button 
                                            type="button"
                                            className=" bg-none outline-none border-0"
                                            onClick={()=>{ setPageState((prev)=>({...prev,passwordType:"text"}))}}
                                        >
                                            <i className="fa-solid fa-eye-slash"></i>
                                        </button>
                                    :
                                        <button 
                                            type="button"
                                            className=" bg-none outline-none border-0"
                                            onClick={()=>{ setPageState((prev)=>({...prev,passwordType:"password"}))}}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                }
                            </div>
                            <p className={`ext-sm font-extralight text-regularRed ${ formDataValidation.passWord ? "visible" :"hidden" }`}>{formDataValidation.passWord}</p>
                        </div>
                        <div className='flex justify-end my-3'>
                            <p onClick={ ()=>{Navigate('/EmailVerification')} } className='text-sm font-robot font-extralight text-regularBlue text-right underline cursor-pointer w-fit'>Forgot Password?</p>
                        </div>
                        <div>
                            {
                                (pageState.isChecking)?
                                    <div className="flex flex-row justify-center items-center bg-encoredGold rounded-md">
                                        <div className="border-encoredGrey h-7 w-7 animate-spin rounded-full border-4 border-t-regularBlack"></div>
                                        <p className="font-semibold p-1 rounded-md text-regularBlack">Signing In...</p>
                                    </div>
                                :
                                    <div>
                                        <input className='bg-encoredGold font-semibold w-[100%] p-1 rounded-md text-regularBlack' type="submit" value="Sign In"/>
                                    </div>
                            }
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignIn;

function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}
