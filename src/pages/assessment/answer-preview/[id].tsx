import PreviewAns from "@/src/components/Assessment/PreviewAns";
import SidebarLayout from "@/src/components/Layout/SidebarLayout";
import {useRouter} from "next/router";
import {FC} from "react";

const AnswerPreview: FC = () => {
  const router = useRouter();
  const {id} = router.query;
  return <SidebarLayout>{id && <PreviewAns id={id} />}</SidebarLayout>;
};
export default AnswerPreview;
