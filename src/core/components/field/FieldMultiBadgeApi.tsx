import * as React from 'react';

import _get from 'lodash/get';

import FieldBadgeApi from './FieldBadgeApi';

interface FieldMultiBadgeApiProps {
    value: any;
    fieldValue?: string;
    apiAction?: (...value: any) => any;
}

const FieldMultiBadgeApi: React.FC<FieldMultiBadgeApiProps> = ({ fieldValue = 'id', value, apiAction }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {value.map((item: any, index: number) => {
                return <FieldBadgeApi key={index} value={_get(item, fieldValue)} apiAction={apiAction} />;
            })}
        </div>
    );
};

export default FieldMultiBadgeApi;
