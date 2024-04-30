import * as React from 'react';

import { Modal } from 'antd/lib';

interface FieldMultipleTextProps {
    value: string;
}

const FieldMultipleText: React.FC<FieldMultipleTextProps> = ({ value }) => {
    const [isShow, setIsShow] = React.useState(false);
    if (!value) {
        return <div></div>;
    }

    return (
        <div>
            <div
                onClick={() => {
                    setIsShow(true);
                }}
            >
                {value.slice(0, 150)} {value.length > 150 && '...'}
            </div>
            <Modal open={isShow} onCancel={() => setIsShow(false)} footer={null}>
                <div className="whitespace-pre-wrap pt-4">{value}</div>
            </Modal>
        </div>
    );
};

export default FieldMultipleText;
