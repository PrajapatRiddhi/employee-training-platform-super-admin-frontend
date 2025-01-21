import React, { createContext, useContext, ReactNode, useState } from 'react';
import Loader from './Loader'; // Import your Loader component

type LoaderContextType =
    | {
          showLoader: () => void;
          hideLoader: () => void;
          loading: boolean;
      }
    | undefined;

const LoaderContext = createContext<LoaderContextType>(undefined);

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};

type LoaderProviderProps = {
    children: ReactNode;
};

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => {
        setLoading(true);
    };

    const hideLoader = () => {
        setLoading(false);
    };

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader, loading }}>
            {children}
            {loading && <Loader />} {/* Conditionally render the Loader component */}
        </LoaderContext.Provider>
    );
};
