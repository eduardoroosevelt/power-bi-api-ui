import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown, fallback = "Algo deu errado") => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};
