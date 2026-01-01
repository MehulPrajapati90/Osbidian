import { requireUnAuth } from '@/actions/user';
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireUnAuth();
    return (
        <div>{children}</div>
    )
}

export default AuthLayout;