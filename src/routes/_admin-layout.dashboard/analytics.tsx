import { createFileRoute } from '@tanstack/react-router';

const Page = () => {
    return <div>Dashboard Analytics</div>;
};

export const Route = createFileRoute('/_admin-layout/dashboard/analytics')({
    component: Page,
});
