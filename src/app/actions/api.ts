"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type ApiRequestOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: TBody;
  auth?: boolean;
};

export const apiRequest = async <TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> => {
  const { method = "GET", body, auth = true } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };

  if (auth) {
    const token = cookies().get("accessToken")?.value;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      cookies().delete("accessToken");
      throw new Error("UNAUTHORIZED");
    }

    let message = "";
    try {
      const data = (await response.json()) as { message?: string } | undefined;
      message = data?.message ?? "";
    } catch {
      message = await response.text();
    }
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
};
