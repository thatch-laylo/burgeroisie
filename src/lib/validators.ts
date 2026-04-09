import { z } from "zod/v4";

export const memberScoreSchema = z.object({
  memberId: z.string().min(1),
  score: z.number().int().min(0).max(100),
});

export const createVisitSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  address: z.string().optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  scores: z.array(memberScoreSchema).min(1, "At least one score is required"),
  burgerDescription: z.string().optional().default(""),
});

export const addCommentSchema = z.object({
  visitId: z.string().min(1),
  memberId: z.string().min(1),
  text: z.string().min(1, "Comment cannot be empty"),
});

export const addQueueItemSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  reason: z.string().optional().default(""),
  suggestedBy: z.string().min(1),
});

export const voteQueueItemSchema = z.object({
  queueItemId: z.string().min(1),
  memberId: z.string().min(1),
});

export const markVisitedSchema = z.object({
  queueItemId: z.string().min(1),
  visitId: z.string().optional(),
});

export type CreateVisitInput = z.infer<typeof createVisitSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
export type AddQueueItemInput = z.infer<typeof addQueueItemSchema>;
