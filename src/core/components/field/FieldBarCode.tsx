import * as React from 'react';

import { QRCode } from 'antd';
import Barcode from 'react-barcode';

interface FieldBarCodeProps {
    value: string;
}

const FieldBarCode: React.FC<FieldBarCodeProps> = ({ value }) => {
    return (
        <div className="">
            <Barcode value={value} />
        </div>
    );
};

export default FieldBarCode;
