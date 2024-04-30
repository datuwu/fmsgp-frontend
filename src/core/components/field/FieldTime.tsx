import * as React from 'react';

import moment from 'moment';

interface FieldTimeProps {
    value: any;
    format: string;
}

const FieldTime: React.FC<FieldTimeProps> = ({ value, format }) => {
    if (!value) return <div>N/A</div>;

    return <div>{moment(value).format(format)}</div>;
};

export default FieldTime;
