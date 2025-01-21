import { Button, Result } from "antd";
import { useRouter } from "next/router";
import { FC } from "react";

const PageNotFound: FC = () => {
    const router=useRouter();
    const {query} =router
    const tenant = query.tenant as string | undefined;

    const message = tenant
        ? `Sorry, the page for tenant "${tenant}" you visited does not exist.`
        : "Sorry, the page you visited does not exist.";

    return (
        <Result
            status="404"
            title="404"
            subTitle={message}
            extra={<Button type="primary">Back Home</Button>}
        />
    );
};
export default PageNotFound;
