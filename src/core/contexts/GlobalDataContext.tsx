import * as React from 'react';

import { useSelector } from 'react-redux';

import { useNKRouter } from '../routing/hooks/NKRouter';
import { RootState } from '../store';
import { UserState } from '../store/user';

export interface IGlobalDataContextContext {
    companyId: string | null;
    setCompanyId: (companyId: string | null) => void;
}

export const GlobalDataContext = React.createContext<IGlobalDataContextContext>({
    companyId: null,
    setCompanyId: () => {},
});

interface GlobalDataProviderProps {
    children: React.ReactNode;
}

export const GlobalDataProvider: React.FC<GlobalDataProviderProps> = ({ children }) => {
    const [companyId, setCompanyId] = React.useState<string | null>(null);

    return (
        <GlobalDataContext.Provider
            value={{
                companyId,
                setCompanyId,
            }}
        >
            {children}
        </GlobalDataContext.Provider>
    );
};

export const useGlobalData = () => React.useContext(GlobalDataContext);
