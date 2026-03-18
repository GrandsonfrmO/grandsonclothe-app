CREATE TABLE "logo_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"logo_url" varchar(500) NOT NULL,
	"site_name" varchar(255) NOT NULL,
	"tagline" varchar(255),
	"favicon_url" varchar(500),
	"user_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "total_amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "guest_email" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "guest_name" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "colors" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sizes" text;--> statement-breakpoint
ALTER TABLE "logo_history" ADD CONSTRAINT "logo_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_orders_user_id" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_created_at" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_orders_guest_email" ON "orders" USING btree ("guest_email");--> statement-breakpoint
CREATE INDEX "idx_products_category" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_products_stock" ON "products" USING btree ("stock");--> statement-breakpoint
CREATE INDEX "idx_products_created_at" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role");