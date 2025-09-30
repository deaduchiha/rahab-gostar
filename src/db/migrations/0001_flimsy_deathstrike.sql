CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text,
	`photo` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_id` ON `invoices` (`id`);