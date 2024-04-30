import * as React from 'react';

import { Input } from 'antd';

interface FieldInputBoxProps {
    value: string;
}

const FieldInputBox: React.FC<FieldInputBoxProps> = ({ value }) => {
    return <Input value={value} readOnly />;
};

export default FieldInputBox;
