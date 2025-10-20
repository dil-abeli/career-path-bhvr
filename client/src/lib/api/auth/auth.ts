import { apiRequest } from "../fetch-client";
import type { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from "shared";

export async function register(data: RegisterRequest): Promise<AuthResponse> {
	return apiRequest<AuthResponse>("/api/auth/register", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
	return apiRequest<AuthResponse>("/api/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function getCurrentUser(): Promise<UserProfile> {
	return apiRequest<UserProfile>("/api/user/me");
}

