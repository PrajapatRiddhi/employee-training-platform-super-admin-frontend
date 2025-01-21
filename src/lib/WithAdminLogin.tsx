import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const withAdminAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const router = useRouter();
        const currentUser = useSelector((state: any) => state.userReducer.user);
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        useEffect(() => {
            if (typeof window !== 'undefined') {
                if (!accessToken || Object.keys(currentUser).length === 0) {
                    // localStorage.clear();
                    let url = `/login`
                    router.push(url);
                } else {
                    router.back();
                }
            }
        }, [accessToken, currentUser, router]);

        // If logged in, render the component
        return <WrappedComponent {...props} />;
    };
};

export default withAdminAuth;
