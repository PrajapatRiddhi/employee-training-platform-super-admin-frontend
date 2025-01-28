import {useRouter} from "next/router";
import CreatePhishing from "./add";

const EditPhishing = () => {
  const router = useRouter();
  const {id} = router.query;
  return <CreatePhishing id={id} />;
};

export default EditPhishing;
