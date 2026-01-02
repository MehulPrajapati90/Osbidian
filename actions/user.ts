"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import client from "@/lib/db";
import { userAgent } from "next/server";

export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/sign-in");
    }

    return session;
};

export const requireUnAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        redirect("/");
    }

    return session;
};

export const currentUser = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return {
                success: false,
                error: "User UnAuthenticated"
            }
        }

        return {
            success: true,
            message: "User Authenticated",
            user: session?.user,
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "User UnAuthenticated or internal server error"
        }
    }
};

export const currentDbUser = async() => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return {
                success: false,
                error: "User UnAuthenticated"
            }
        }

        const dbUser = await client.user.findFirst({
            where: {
                id: session.user?.id
            },
        })

        return {
            success: true,
            message: "User Authenticated",
            user: dbUser,
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "User UnAuthenticated or internal server error"
        }
    }
}

export const checkUsername = async ({ username }: CheckUsernameType) => {
    const { user } = await currentUser();

    try {
        const isExist = await client.user.findUnique({
            where: {
                id: user?.id,
                username: username
            }
        });

        if (isExist?.username) {
            return {
                success: false,
                error: "Username already exist, try something unique",
                username: "",
            }
        };

        return {
            success: true,
            message: "Username found successfully",
            username: username,
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "failed to find a unique username",
            username: "",
        }
    }
}

export const claimUsername = async ({ username }: ClaimUsernameType) => {
    const { user } = await currentUser();

    try {
        const isExist = await client.user.findUnique({
            where: {
                id: user?.id,
                username: username
            }
        });

        if (isExist?.username) {
            return {
                success: false,
                error: "Username already exist, try something unique"
            }
        };

        const createUser = await client.user.update({
            where: {
                id: user?.id,
            },
            data: {
                username: username
            }
        });

        return {
            success: true,
            message: "Username created successfully"
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "failed to created a unique username"
        }
    }
}