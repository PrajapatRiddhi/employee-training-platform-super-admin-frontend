import {useRouter} from "next/router";
import CreateCourses from "./add";

const EditCourse = () => {
  const router = useRouter();
  const {id} = router.query;
  return <CreateCourses id={id} />;
};

export default EditCourse;
