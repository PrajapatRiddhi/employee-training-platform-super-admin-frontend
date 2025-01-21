// import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
// import Router from 'next/router';
// import { config } from '../helper/config';

// // Create an Axios instance with default headers
// const axiosInstance: AxiosInstance = axios.create({
//     baseURL: `${config.apiBaseUrl}${config.apiPath.v0}`,
//     headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*',
//         maxBodyLength: Infinity,
//     },
// });

// const setAuthorizationHeader = (): string => {
//     if (process.browser && typeof window !== 'undefined') {
//         const token = localStorage.getItem('token');
//         console.log('token :>> ', token);
//         return token ? `Bearer ${token}` : '';
//     }
//     return '';
// };
// const setTenetHeader = (): string => {
//     if (process.browser && typeof window !== 'undefined') {
//         const tenantId = localStorage.getItem('tenantId');
//         console.log('tenantId :>> ', tenantId);
//         return tenantId || '';
//     }
//     return '';
// };
// axiosInstance.interceptors.request.use((config) => {
//     // Set the Authorization header using the dynamically retrieved token
//     config.headers.Authorization = setAuthorizationHeader();
//     config.headers["tenantId"] =setTenetHeader();
//     return config;
// });

// let refresh = false;

// export interface AxiosCustomResponse {
//     data: any;
//     settings: Settings;
// }

// export interface Settings {
//     success: number;
//     message: string;
//     status: number;
//     count?: number;
//     offset?: number;
//     per_page?: number;
//     curr_page?: number;
//     prev_page?: number;
//     next_page?: number;
// }

// axiosInstance.interceptors.response.use(
//     (resp: AxiosResponse<any>) => {

//         return resp.data;
//     },
//     async (error: AxiosError) => {
//         if ((error.response?.status === 401 || error.response?.status === 500) && !refresh) {
//             refresh = true;
//             localStorage.clear();
//             Router.push('/login')
//         }
//         refresh = false;
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;

import axios, {AxiosInstance, AxiosResponse, AxiosError} from "axios";
import Router from "next/router";
import {config} from "../helper/config";

// Create an Axios instance with default headers
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${config.apiBaseUrl}${config.apiPath.v0}`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    maxBodyLength: Infinity,
  },
});

// Add interceptors to handle client-specific headers
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    // Use the context from Next.js pages to handle headers on the server side
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // const tenantId = (typeof window !== 'undefined') ? localStorage.getItem('tenantId') : null;

    requestConfig.headers.Authorization = token ? `Bearer ${token}` : "";
    // requestConfig.headers["tenantId"] = tenantId || '';

    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refresh = false;

export interface AxiosCustomResponse {
  data: any;
  settings: Settings;
}

export interface Settings {
  success: number;
  message: string;
  status: number;
  count?: number;
  offset?: number;
  per_page?: number;
  curr_page?: number;
  prev_page?: number;
  next_page?: number;
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response.data;
  },
  async (error: AxiosError) => {
    if (
      (error.response?.status === 401 || error.response?.status === 500) &&
      !refresh
    ) {
      refresh = true;
      // Clear localStorage on client-side only
      if (typeof window !== "undefined") {
        localStorage.clear();
        Router.push("/login");
      }
    }
    refresh = false;
    return Promise.reject(error);
  }
);

export default axiosInstance;
