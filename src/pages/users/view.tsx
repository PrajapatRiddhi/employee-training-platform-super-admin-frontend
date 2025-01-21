import {useRouter} from "next/router";
import {FC} from "react";
import AddUsers from "./add";

const ViewUsers: FC = () => {
  const router = useRouter();
  const {id} = router.query;
  return (
    <div>
      <AddUsers id={id} viewOnly={true} />
    </div>
  );
};
export default ViewUsers;
