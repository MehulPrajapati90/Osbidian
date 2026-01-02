import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { z } from "zod";
import { Message, realtime } from "@/lib/realtime";
import { currentDbUser } from "@/actions/user";
import { nanoid } from "nanoid";

const rooms = new Elysia({ prefix: "/room" })
    .post("/create", async ({ body }) => {
        const { roomId, ttl } = body;

        const { user } = await currentDbUser();

        await redis.hset(`meta:${roomId}`, {
            connected: [],
            createdAt: Date.now(),
        });

        const meta = await redis.hgetall<{ connected: string[]; createdAt: number }>(
            `meta:${roomId}`
        )

        await redis.hset(`meta:${roomId}`, {
            connected: [...meta?.connected as string[], user?.id]
        })

        await redis.expire(`meta:${roomId}`, ttl)

        return { roomId };
    }, {
        body: z.object({
            roomId: z.string("Not a valid string"),
            ttl: z.number("Not a valid number").min(600).max(3600)
        })
    })
    .get("/ttl",
        async () => {
            const { user } = await currentDbUser();

            const ttl = await redis.ttl(`meta:${user?.roomId}`)
            return { ttl: ttl > 0 ? ttl : 0 }
        },
        { query: z.object({ roomId: z.string() }) }
    )
    .delete("/",
        async () => {
            const { user } = await currentDbUser();
            await realtime.channel(user?.roomId!).emit("chat.destroy", { isDestroyed: true })

            await Promise.all([
                redis.del(user?.roomId!),
                redis.del(`meta:${user?.roomId!}`),
                redis.del(`messages:${user?.roomId!}`),
            ])
        },
        { query: z.object({ roomId: z.string() }) }
    )
    .post('/join-room', async ({ body }) => {

        const { roomId } = body;
        const { user } = await currentDbUser();

        const roomExists = await redis.exists(`meta:${roomId}`);

        if (!roomExists) {
            throw new Error("Room does not exist")
        }

        const meta = await redis.hgetall<{ connected: string[]; createdAt: number }>(
            `meta:${roomId!}`
        );

        if (meta?.connected?.length ?? 0 >= 2) {
            throw new Error("Maximum people reached");
        }

        await redis.hset(`meta:${roomId}`, {
            connected: [...meta?.connected as string[], user?.id]
        })
    }, {
        body: z.object({
            roomId: z.string("Not a valid string"),
        })
    })

const messages = new Elysia({ prefix: "/messages" })
    .post("/",
        async ({ body }) => {
            const { sender, text, roomId } = body;

            const { user } = await currentDbUser();

            const roomExists = await redis.exists(`meta:${roomId}`)

            if (!roomExists) {
                throw new Error("Room does not exist")
            }

            const message: Message = {
                id: nanoid(),
                sender,
                text,
                timestamp: Date.now(),
                roomId,
            }

            // add message to history and emit event to subscribers
            await redis.rpush(`messages:${roomId}`, { ...message, token: user?.id! })
            await realtime.channel(roomId).emit("chat.message", message)

            // housekeeping
            const remaining = await redis.ttl(`meta:${roomId}`)

            await redis.expire(`messages:${roomId}`, remaining)
            await redis.expire(`history:${roomId}`, remaining)
            await redis.expire(roomId, remaining)
        },
        {
            query: z.object({ roomId: z.string() }),
            body: z.object({
                sender: z.string().max(100),
                text: z.string().max(1000),
                roomId: z.string()
            }),
        }
    )
    .get("/",
        async () => {
            const { user } = await currentDbUser();
            const messages = await redis.lrange<Message>(`messages:${user?.roomId!}`, 0, -1)

            return {
                messages: messages.map((m) => ({
                    ...m,
                    token: m.token === user?.id! ? user?.id! : undefined,
                })),
            }
        },
        { query: z.object({ roomId: z.string() }) }
    )

const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

export const GET = app.fetch
export const POST = app.fetch
export const DELETE = app.fetch

export type App = typeof app;