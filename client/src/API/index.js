import axios from "axios";

const USER_BASE_URL = "http://localhost:8888/api/"

const axiosConfig = axios.create({
    withCredentials: true,
    baseURL: USER_BASE_URL,
});

export const fetchApi = async ({...options}) => {

  const onSuccess = (response) => response;

  const onError = (error) => error

  return await axiosConfig(options).then(onSuccess).catch(onError);
}