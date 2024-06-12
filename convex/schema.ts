import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  podcasts: defineTable({
    audioStorageId: v.optional(v.id("_storage")),
  }),
});
