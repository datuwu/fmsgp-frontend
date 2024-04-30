import React from 'react';

import { createFileRoute, useParams } from '@tanstack/react-router';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
    const { id } = Route.useParams();

    return <div>Dynamic Dashboard Page: {id}</div>;
};

export const Route = createFileRoute('/_admin-layout/dashboard/$id')({
    component: Page,
});
