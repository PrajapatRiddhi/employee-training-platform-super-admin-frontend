import {useRouter} from "next/router";
import {FC} from "react";
import CreateNotification from "./add";

const EditTemplateNotfication: FC = () => {
  const router = useRouter();
  const {id} = router.query;
  return (
    <div>
      <CreateNotification id={id} viewOnly={false} />
    </div>
  );
};
export default EditTemplateNotfication;
