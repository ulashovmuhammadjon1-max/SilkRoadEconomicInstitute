import { toNextJsHandler } from "better-auth/next-js";
import { features } from "@/lib/features";
import { auth } from "@/lib/server/auth";

const handlers = toNextJsHandler(auth.handler);
const off = () => new Response("Accounts are not enabled yet.", { status: 404 });

export const GET = features.accounts ? handlers.GET : off;
export const POST = features.accounts ? handlers.POST : off;
