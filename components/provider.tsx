"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RealtimeProvider } from "@upstash/realtime/client";

import React, { useState } from 'react'

const Provider = ({ children }: { children: React.ReactNode }) => {
    const [client] = useState(() => new QueryClient());
    return (
        <RealtimeProvider>
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        </RealtimeProvider>
    )
}

export default Provider;