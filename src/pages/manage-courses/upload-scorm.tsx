import {useRouter} from "next/router";
import CreateCourses from "./add";

const UploadScormCourses = () => {
  const router = useRouter();
  const {id} = router.query;

  return <CreateCourses id={id} uploadScorm={true} />;
};

export default UploadScormCourses;
