const API_BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export async function apiRequest<T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	const token = localStorage.getItem("auth_token");

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (options?.headers) {
		Object.entries(options.headers).forEach(([key, value]) => {
			if (typeof value === "string") {
				headers[key] = value;
			}
		});
	}

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}

	return response.json();
}

