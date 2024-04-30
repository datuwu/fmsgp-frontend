import { useRouter } from '@tanstack/react-router';

export const useNKPathname = () => {
    return useRouter().history.location.pathname;
};
