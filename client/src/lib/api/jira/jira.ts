import { apiRequest } from "../fetch-client";

interface JiraSyncResponse {
	success: boolean;
	message: string;
	synced: number;
}

export async function syncJiraData(since?: string): Promise<JiraSyncResponse> {
	return apiRequest<JiraSyncResponse>("/api/jira/sync", {
		method: "POST",
		body: JSON.stringify({ since }),
	});
}

