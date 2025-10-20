import { apiRequest } from "../fetch-client";

interface SyncResponse {
	success: boolean;
	message: string;
	synced: {
		prs: number;
		reviews: number;
		commits: number;
	};
}

export async function syncGitHubData(since?: string): Promise<SyncResponse> {
	return apiRequest<SyncResponse>("/api/github/sync", {
		method: "POST",
		body: JSON.stringify({ since }),
	});
}

