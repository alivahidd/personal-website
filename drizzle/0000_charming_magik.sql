CREATE TABLE `portfolio_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`type` text DEFAULT 'Film' NOT NULL,
	`year` text DEFAULT '—' NOT NULL,
	`hero_image` text NOT NULL,
	`video_id` text DEFAULT '' NOT NULL,
	`gallery_images` text DEFAULT '[]' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`credits` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolio_items_slug_unique` ON `portfolio_items` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_portfolio_items_sort_order` ON `portfolio_items` (`sort_order`);
--> statement-breakpoint
INSERT INTO `portfolio_items` (`slug`, `title`, `type`, `year`, `hero_image`, `video_id`, `gallery_images`, `description`, `credits`, `sort_order`) VALUES
('untitled-blue-room', 'Untitled Blue Room', 'Film / placeholder', '—', '/assets/project-blue-room.png', '7JDaOOw0MEE', '["/assets/project-blue-room.png","/assets/project-fabric.png"]', '', '', 1),
('soft-boundaries', 'Soft Boundaries', 'Moving image / placeholder', '—', '/assets/project-fabric.png', '7JDaOOw0MEE', '["/assets/project-fabric.png","/assets/project-blue-room.png"]', '', '', 2),
('after-theatre', 'After Theatre', 'Performance / placeholder', '—', '/assets/theatre-placeholder.png', '7JDaOOw0MEE', '["/assets/theatre-placeholder.png","/assets/project-fabric.png"]', '', '', 3);
