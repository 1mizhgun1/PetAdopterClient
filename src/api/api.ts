import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useUser } from '../hooks/useUser';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:80/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json", //this line solved cors
    },
});

export const useApi = () => {
    const { isAuthenticated, token, username } = useUser();
    const [config, setConfig] = useState<AxiosRequestConfig>({});

    useEffect(() => {
        if (isAuthenticated && token && username) {
            setConfig({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    username: username,
                },
            });
        } else {
            setConfig({});
        }
    }, [isAuthenticated, token, username]);

    const get = async <T>(url: string, params?: any): Promise<AxiosResponse<T>> => {
        return api.get<T>(url, { ...config, params });
    };

    const post = async <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
        return api.post<T>(url, data, config);
    };

    return { get, post };
};
