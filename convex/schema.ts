import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(v.literal('image'), v.literal('pdf'), v.literal('csv'))

export default defineSchema({
  files: defineTable({ 
    name: v.string(), 
    type: fileTypes,
    fileId: v.id("_storage") 
  }),
});