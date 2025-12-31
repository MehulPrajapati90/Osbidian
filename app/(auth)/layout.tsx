import { requireUnAuth } from '@/actions/auth';
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireUnAuth();
    return (
        <div>{children}</div>
    )
}

export default AuthLayout;