import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  },
  handler: async (ctx, arg) => {
    await ctx.db.insert('users', {
        clerkId: arg.clerkId,
        email: arg.email,
        imgUrl: arg.imageUrl,
        name: arg.name
        
    })
  },
});
