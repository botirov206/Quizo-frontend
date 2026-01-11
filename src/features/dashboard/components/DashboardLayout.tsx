import type { FC } from 'react';
import type { DashboardLayoutProps } from '../types';
import { useBreadcrumb } from '../hooks/useBreadcrumb';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const breadcrumbs = useBreadcrumb();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar">
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-4 rounded-xl bg-background p-4" style={{ border: '1px solid #dadada' }}>
            <header className="flex h-12 shrink-0 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <BreadcrumbItem>
                        {item.current ? (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <main className="flex flex-1 flex-col gap-4">
              {children}
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
