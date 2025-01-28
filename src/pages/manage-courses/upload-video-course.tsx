import {useRouter} from "next/router";
import CreateCourses from "./add";

const UploadVideoCourses = () => {
  const router = useRouter();
  const {id} = router.query;

  return <CreateCourses id={id} uploadVideo={true} />;
};

export default UploadVideoCourses;
