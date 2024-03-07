import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage")
    },
    async handler(ctx, args){
        await ctx.db.insert('files', {
            name: args.name,
            fileId: args.fileId
        })
    }
})

export const getFiles = query({
    args: {},
    async handler(ctx, args){
        return ctx.db.query('files').collect();
    }
})

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});