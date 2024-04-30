import * as React from 'react';

import _get from 'lodash/get';
import { FaRegFile } from 'react-icons/fa';

import NKLink from '@/core/routing/components/NKLink';

interface FieldLinkFileProps {
    value: string;
    formatter?: (value: any) => any;
}

const FieldLinkFile: React.FC<FieldLinkFileProps> = ({ value }) => {
    return (
        <div className="inline-flex border border-dashed border-gray-200 p-2 text-2xl">
            <NKLink href={value} target="_blank">
                <FaRegFile />
            </NKLink>
        </div>
    );
};

export default FieldLinkFile;
