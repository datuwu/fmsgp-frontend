import * as React from 'react';

import { Breadcrumb } from 'antd';

import { useNKRouter } from '@/core/routing/hooks/NKRouter';

interface NKBreadcrumbProps {
    items: {
        title: string;
        href: string;
    }[];
}

const NKBreadcrumb: React.FC<NKBreadcrumbProps> = ({ items }) => {
    const router = useNKRouter();

    return (
        <div>
            <Breadcrumb
                items={items.map((item) => ({
                    title: item.title,
                    className: 'cursor-pointer',
                    onClick: () => router.push(item.href),
                }))}
            />
        </div>
    );
};

export default NKBreadcrumb;
