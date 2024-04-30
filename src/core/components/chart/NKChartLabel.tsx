import * as React from 'react';

import clsx from 'clsx';

interface NKChartLabelProps {
    label: string;
    value: number;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    color: 'red' | 'blue' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray' | 'white' | 'black';
    precision?: number;
}

const NKChartLabel: React.FC<NKChartLabelProps> = ({ label, value, color, precision = 2, prefix, suffix }) => {
    return (
        <div
            className={clsx('rounded-lg p-4 text-white shadow-lg ', {
                'bg-red-500 shadow-red-500/70': color === 'red',
                'bg-blue-500 shadow-blue-500/70': color === 'blue',
                'bg-green-500 shadow-green-500/70': color === 'green',
                'bg-yellow-500 shadow-yellow-500/70': color === 'yellow',
                'bg-indigo-500 shadow-indigo-500/70': color === 'indigo',
                'bg-purple-500 shadow-purple-500/70': color === 'purple',
                'bg-pink-500 shadow-pink-500/70': color === 'pink',
                'bg-gray-500 shadow-gray-500/70': color === 'gray',
                'shadow-white-500/70 bg-white': color === 'white',
                'shadow-black-500/70 bg-black': color === 'black',
            })}
        >
            <div className="text-lg font-semibold">{label}</div>
            <div className="mt-4 flex items-center gap-2">
                {prefix}
                <div className="h-9 text-3xl">{value}</div>
                {suffix}
            </div>
        </div>
    );
};

export default NKChartLabel;
