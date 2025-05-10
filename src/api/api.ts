import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useUser } from '../hooks/useUser';

const API_BASE_URL = 'http://localhost/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json", //this line solved cors
    },
});

export const useApi = () => {
    const { token, username } = useUser();

    const get = async <T>(url: string): Promise<AxiosResponse<T>> => {
        const config: AxiosRequestConfig = {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            params: username ? { username } : {},
        };
        return api.get<T>(url, config);
    };

    const post = async <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
        const isFormData = data instanceof FormData;

        return api.post<T>(url, data, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
            },
            params: username ? { username } : {},
        });
    };

    return { get, post };
};
