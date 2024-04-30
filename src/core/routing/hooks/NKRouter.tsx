import { useNavigate, useRouter } from '@tanstack/react-router';

export const useNKRouter = () => {
    const navigate = useNavigate();
    const router = useRouter();

    const push = (path: string) => {
        navigate({
            to: path,
        });
    };

    const replace = (path: string) => {
        navigate({
            to: path,
            replace: true,
        });
    };

    const back = () => {
        router.history.back();
    };

    const forward = () => {
        router.history.forward();
    };

    return { push, replace, back, forward };
};
