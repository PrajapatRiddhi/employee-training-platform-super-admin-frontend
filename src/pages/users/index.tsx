import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import UserListing from "@/src/components/UserManage/UserListing";

const UsersListingPage = () => {
  return (
    <SidebarLayout>
      <UserListing />
    </SidebarLayout>
  );
};

export default UsersListingPage;
