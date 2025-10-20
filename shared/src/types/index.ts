export type ApiResponse = {
  message: string;
  success: true;
}

export type CareerLevel = "junior" | "mid" | "senior" | "staff" | "principal";

export type UserProfile = {
	id: string;
	email: string;
	fullName: string;
	currentLevel: string;
	targetLevel?: string;
	avatarUrl?: string;
	createdAt: string;
};

export type RegisterRequest = {
	email: string;
	password: string;
	fullName: string;
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type AuthResponse = {
	success: boolean;
	token: string;
	user: Omit<UserProfile, "createdAt">;
};

export type UpdateUserProfileRequest = {
	fullName?: string;
	currentLevel?: string;
	targetLevel?: string;
	avatarUrl?: string;
};

export type CredentialProvider = "github" | "jira" | "confluence";

export type ConnectCredentialRequest = {
	provider: CredentialProvider;
	token: string;
	metadata?: Record<string, any>;
};

export type CredentialInfo = {
	id: string;
	provider: CredentialProvider;
	isValid: boolean;
	lastValidatedAt?: string;
	metadata?: Record<string, any>;
	createdAt: string;
};

export type GoalStatus = "active" | "completed" | "cancelled" | "paused";

export type MetricType =
	| "prs_merged"
	| "prs_created"
	| "reviews_completed"
	| "tickets_completed"
	| "story_points"
	| "commits"
	| "custom";

export type Goal = {
	id: string;
	title: string;
	description?: string;
	metricType: MetricType;
	targetValue: number;
	currentValue: number;
	unit: string;
	deadline?: string;
	status: GoalStatus;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateGoalRequest = {
	title: string;
	description?: string;
	metricType: MetricType;
	targetValue: number;
	unit: string;
	deadline?: string;
};

export type UpdateGoalRequest = {
	title?: string;
	description?: string;
	targetValue?: number;
	deadline?: string;
	status?: GoalStatus;
};

export type InsightType = "weekly_summary" | "monthly_report" | "recommendation" | "anomaly";

export type Insight = {
	id: string;
	type: InsightType;
	title: string;
	content: string;
	metadata?: Record<string, any>;
	periodStart?: string;
	periodEnd: string;
	isRead: boolean;
	createdAt: string;
};

export type MetricsSnapshot = {
	id: string;
	snapshotDate: string;
	period: string;
	prsMerged: number;
	prsCreated: number;
	reviewsCompleted: number;
	commitsCount: number;
	linesAdded: number;
	linesDeleted: number;
	ticketsCompleted: number;
	storyPointsCompleted: number;
	bugsFixed: number;
	featuresDelivered: number;
};

export type DashboardMetrics = {
	current: MetricsSnapshot;
	previous?: MetricsSnapshot;
	goals: Goal[];
	recentInsights: Insight[];
};

export type PromotionReadiness = {
	overallScore: number;
	maxScore: number;
	percentage: number;
	dimensions: {
		technicalOutput: { score: number; maxScore: number };
		collaboration: { score: number; maxScore: number };
		ownership: { score: number; maxScore: number };
		growth: { score: number; maxScore: number };
	};
	gaps: string[];
	strengths: string[];
};

export type Skill = {
	id: string;
	name: string;
	category: string;
	proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
	yearsOfExperience?: number;
	lastUsed?: string;
	createdAt: string;
	updatedAt: string;
};

export type CreateSkillRequest = {
	name: string;
	category: string;
	proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
	yearsOfExperience?: number;
};
