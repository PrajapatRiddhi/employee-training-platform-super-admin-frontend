import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import { useRouter } from "next/router";
import AddUsers from "./add";

const EditProfile = () => {
    const router =useRouter();
    const {query} = router
    return (
        < > 
            <AddUsers id={query?.id} viewOnly={false} />
        </>
    )
}
export default EditProfile;