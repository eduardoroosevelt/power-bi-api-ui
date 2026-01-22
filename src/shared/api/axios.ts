import axios, { AxiosError } from "axios";
import { env } from "@/shared/utils/env";
import { useAuthStore } from "@/store/auth.store";

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      useAuthStore.getState().logout();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);
