import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import Message from "@/src/components/Messages";
import { FC } from "react";

const MessagesPage:FC = () => {
    return (
        <SidebarLayout>
            <Message />
        </SidebarLayout>
    );
}
export default MessagesPage;