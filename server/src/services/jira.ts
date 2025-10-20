import { db } from "../db";
import { jiraTickets, type NewJiraTicket } from "../db/schema";
import { eq, and } from "drizzle-orm";

interface JiraIssue {
	id: string;
	key: string;
	fields: {
		summary: string;
		description?: string;
		status: { name: string };
		issuetype: { name: string };
		priority?: { name: string };
		assignee?: { displayName: string; emailAddress: string };
		reporter: { displayName: string };
		project: { name: string };
		created: string;
		updated: string;
		resolutiondate?: string;
		duedate?: string;
		labels?: string[];
		timetracking?: {
			originalEstimate?: string;
			timeSpent?: string;
			originalEstimateSeconds?: number;
			timeSpentSeconds?: number;
		};
		customfield_10016?: number;
	};
}

function parseTimeToSeconds(timeString?: string): number {
	if (!timeString) return 0;
	const hours = timeString.match(/(\d+)h/);
	const minutes = timeString.match(/(\d+)m/);
	return (
		(hours && hours[1] ? parseInt(hours[1]) * 3600 : 0) +
		(minutes && minutes[1] ? parseInt(minutes[1]) * 60 : 0)
	);
}

export class JiraService {
	private token: string;
	private email: string;
	private domain: string;

	constructor(token: string, email: string, domain: string) {
		this.token = token;
		this.email = email;
		this.domain = domain;
	}

	private async fetch(path: string): Promise<any> {
		const auth = Buffer.from(`${this.email}:${this.token}`).toString("base64");

		const response = await fetch(`https://${this.domain}.atlassian.net${path}`, {
			headers: {
				Authorization: `Basic ${auth}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Jira API error: ${response.status} ${response.statusText}`
			);
		}

		return response.json();
	}

	async getUserInfo(): Promise<{ accountId: string; displayName: string; emailAddress: string }> {
		return this.fetch("/rest/api/3/myself");
	}

	async syncIssues(
		userId: string,
		userEmail: string,
		since?: Date
	): Promise<number> {
		const sinceJql = since
			? ` AND updated >= "${since.toISOString().split("T")[0]}"`
			: "";

		const jql = `assignee = currentUser()${sinceJql} ORDER BY updated DESC`;

		const response = await this.fetch(
			`/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=100&fields=summary,description,status,issuetype,priority,assignee,reporter,project,created,updated,resolutiondate,duedate,labels,timetracking,customfield_10016`
		);

		const issues: JiraIssue[] = response.issues || [];

		let synced = 0;

		for (const issue of issues) {
			const existing = await db.query.jiraTickets.findFirst({
				where: and(
					eq(jiraTickets.userId, userId),
					eq(jiraTickets.jiraId, issue.id)
				),
			});

			const storyPoints =
				issue.fields.customfield_10016 ||
				(issue.fields.issuetype.name === "Story" ? 1 : 0);

			const ticketData: NewJiraTicket = {
				userId,
				jiraId: issue.id,
				key: issue.key,
				title: issue.fields.summary,
				description: issue.fields.description,
				status: issue.fields.status.name,
				issueType: issue.fields.issuetype.name,
				priority: issue.fields.priority?.name,
				storyPoints,
				timeEstimate:
					issue.fields.timetracking?.originalEstimateSeconds ||
					parseTimeToSeconds(issue.fields.timetracking?.originalEstimate),
				timeSpent:
					issue.fields.timetracking?.timeSpentSeconds ||
					parseTimeToSeconds(issue.fields.timetracking?.timeSpent),
				assignee: issue.fields.assignee?.displayName,
				reporter: issue.fields.reporter.displayName,
				project: issue.fields.project.name,
				createdAt: new Date(issue.fields.created),
				updatedAt: new Date(issue.fields.updated),
				resolvedAt: issue.fields.resolutiondate
					? new Date(issue.fields.resolutiondate)
					: null,
				dueDate: issue.fields.duedate
					? new Date(issue.fields.duedate)
					: null,
				labels: issue.fields.labels || [],
				url: `https://${this.domain}.atlassian.net/browse/${issue.key}`,
				syncedAt: new Date(),
			};

			if (existing) {
				await db
					.update(jiraTickets)
					.set(ticketData)
					.where(eq(jiraTickets.id, existing.id));
			} else {
				await db.insert(jiraTickets).values(ticketData);
			}

			synced++;
		}

		return synced;
	}
}

export async function createJiraService(
	token: string,
	email: string,
	domain: string
): Promise<JiraService> {
	const service = new JiraService(token, email, domain);
	await service.getUserInfo();
	return service;
}

