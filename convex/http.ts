import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";



const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occured", {
      status: 400,
    });
  }
  switch (event.type) {
    case "user.created": 
    await ctx.runMutation(internal.users.createUser,{
      clerkId: event.data.id,
      email: event.data.email_addresses[0].email_address,
      imageUrl: event.data.image_url,
      name: event.data.full_name!,

    })
    // case "user.updated": {
    //   const existingUser = await ctx.runQuery(internal.users.getUser, {
    //     subject: event.data.id,
    //   });
    //   if (existingUser && event.type === "user.created") {
    //     console.warn("Overwriting user", event.data.id, "with", event.data);
    //   }
    //   console.log("creating/updating user", event.data.id);
    //   await ctx.runMutation(internal.users.updateOrCreateUser, {
    //     clerkUser: event.data,
    //   });
    //   break;
    // }
    // case "user.deleted": {
    //   // Clerk docs say this is required, but the types say optional?
    //   const id = event.data.id!;
    //   await ctx.runMutation(internal.users.deleteUser, { id });
    //   break;
    // }
    default: {
      console.log("ignored Clerk webhook event", event.type);
    }
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

async function validateRequest(
  req: Request
): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (_) {
    console.log("error verifying");
    return;
  }

  return evt as unknown as WebhookEvent;
}

export default http;