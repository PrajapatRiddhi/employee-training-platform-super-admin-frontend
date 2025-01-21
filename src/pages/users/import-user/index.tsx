'use client';
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import ImportUsers from "@/src/components/Users/import-users";
import { FC } from "react";
import dynamic from 'next/dynamic';

// const ImportUsers = dynamic(() => import('@/src/components/Users/import-users'), { ssr: false });

const ImportUsersPage: FC = () => {
  return (
    <SidebarLayout>
      <ImportUsers />
    </SidebarLayout>
  );
};

export default ImportUsersPage;
