import * as React from 'react';

import Tippy from '@tippyjs/react';

import NKLink from '@/core/routing/components/NKLink';

interface FieldLinkButtonProps {
    value: string;
    label?: string;
}

const FieldLinkButton: React.FC<FieldLinkButtonProps> = ({ value, label }) => {
    return (
        <Tippy content={value} placement="top-start" interactive>
            <NKLink target="_blank" href={value}>
                {label ? label : value.slice(0, 20)}
            </NKLink>
        </Tippy>
    );
};

export default FieldLinkButton;
