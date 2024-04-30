import * as React from 'react';

import { EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';

import DrawerBuilder from '../drawer/DrawerBuilder';

interface FieldRichTextProps {
    value: any;
}

const FieldRichText: React.FC<FieldRichTextProps> = ({ value }) => {
    return (
        <div className="relative">
            <DrawerBuilder
                btnLabel=""
                btnProps={{
                    className: 'absolute z-50 top-1 left-1',
                    icon: <EyeOutlined />,
                    type: 'primary',
                    size: 'small',
                }}
                drawerTitle=""
                width="700px"
            >
                <div className="ql-container  ql-snow  !border-none" dangerouslySetInnerHTML={{ __html: value }} />
            </DrawerBuilder>
            <div className="ql-editor relative max-h-[200px] w-full border border-solid border-tango-100 !px-3 !pb-4 !pt-8">
                <div dangerouslySetInnerHTML={{ __html: value }} className="ql-container ql-snow  !border-none" />
            </div>
        </div>
    );
};

export default FieldRichText;
