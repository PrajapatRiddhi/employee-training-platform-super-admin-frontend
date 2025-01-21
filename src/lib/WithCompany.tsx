import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
/* Admin either team leader or project manager  */

const withCompanyAuth = (WrappedComponent: any) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        // checks whether we are on client / browser or server.
        if (typeof window !== 'undefined') {
            const router = useRouter();
            const currentUser = useSelector((state: any) => state.userReducer.user);
            const accessToken = localStorage.getItem('token');
            if (!accessToken || Object.keys(currentUser).length===0) {
                router.replace('/login');
                return null;
            }
            return <WrappedComponent {...props} />;
        }
        // If we are on server, return null
        return null;
    };
};

export default withCompanyAuth;
