CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text NOT NULL,
	`avatar_url` text,
	`current_level` text DEFAULT 'junior' NOT NULL,
	`target_level` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`encrypted_token` text NOT NULL,
	`encrypted_iv` text NOT NULL,
	`metadata` text,
	`is_valid` integer DEFAULT true NOT NULL,
	`last_validated_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `github_commits` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`sha` text NOT NULL,
	`repository` text NOT NULL,
	`message` text NOT NULL,
	`author` text NOT NULL,
	`committed_at` integer NOT NULL,
	`additions` integer DEFAULT 0 NOT NULL,
	`deletions` integer DEFAULT 0 NOT NULL,
	`url` text NOT NULL,
	`synced_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `github_pull_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`github_id` integer NOT NULL,
	`number` integer NOT NULL,
	`title` text NOT NULL,
	`state` text NOT NULL,
	`repository` text NOT NULL,
	`author` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`merged_at` integer,
	`closed_at` integer,
	`additions` integer DEFAULT 0 NOT NULL,
	`deletions` integer DEFAULT 0 NOT NULL,
	`changed_files` integer DEFAULT 0 NOT NULL,
	`review_count` integer DEFAULT 0 NOT NULL,
	`comment_count` integer DEFAULT 0 NOT NULL,
	`url` text NOT NULL,
	`synced_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `github_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`github_id` integer NOT NULL,
	`pull_request_number` integer NOT NULL,
	`repository` text NOT NULL,
	`state` text NOT NULL,
	`reviewer` text NOT NULL,
	`submitted_at` integer NOT NULL,
	`comment_count` integer DEFAULT 0 NOT NULL,
	`body` text,
	`url` text NOT NULL,
	`synced_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `jira_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`jira_id` text NOT NULL,
	`key` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`issue_type` text NOT NULL,
	`priority` text,
	`story_points` real,
	`time_estimate` integer,
	`time_spent` integer,
	`assignee` text,
	`reporter` text NOT NULL,
	`project` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`resolved_at` integer,
	`due_date` integer,
	`labels` text DEFAULT '[]',
	`url` text NOT NULL,
	`synced_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`metric_type` text NOT NULL,
	`target_value` real NOT NULL,
	`current_value` real DEFAULT 0 NOT NULL,
	`unit` text NOT NULL,
	`deadline` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`is_template` integer DEFAULT false NOT NULL,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `insights` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`period_start` integer,
	`period_end` integer NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `metrics_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`snapshot_date` integer NOT NULL,
	`period` text NOT NULL,
	`prs_merged` integer DEFAULT 0 NOT NULL,
	`prs_created` integer DEFAULT 0 NOT NULL,
	`reviews_completed` integer DEFAULT 0 NOT NULL,
	`commits_count` integer DEFAULT 0 NOT NULL,
	`lines_added` integer DEFAULT 0 NOT NULL,
	`lines_deleted` integer DEFAULT 0 NOT NULL,
	`tickets_completed` integer DEFAULT 0 NOT NULL,
	`story_points_completed` real DEFAULT 0 NOT NULL,
	`bugs_fixed` integer DEFAULT 0 NOT NULL,
	`features_delivered` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`proficiency_level` text NOT NULL,
	`years_of_experience` integer,
	`last_used` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
