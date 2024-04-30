import * as React from 'react';

import { QRCode } from 'antd';

interface FieldQrCodeProps {
    value: string;
    size?: number;
}

const FieldQrCode: React.FC<FieldQrCodeProps> = ({ value, size }) => {
    return (
        <div>
            <QRCode value={value} size={size} />
        </div>
    );
};

export default FieldQrCode;
