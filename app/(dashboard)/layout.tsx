import { requireAuth } from '@/actions/user';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SiteHeader } from '@/components/dashboard/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireAuth();
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div>{children}</div>
                <Toaster position='bottom-right' />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout;