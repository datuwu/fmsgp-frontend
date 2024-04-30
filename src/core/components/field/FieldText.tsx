import * as React from 'react';

interface FieldTextProps {
    value: string;
}

const FieldText: React.FC<FieldTextProps> = ({ value }) => {
    return <div>{value}</div>;
};

export default FieldText;
