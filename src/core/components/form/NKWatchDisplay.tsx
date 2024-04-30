import * as React from 'react';

import { useFormContext } from 'react-hook-form';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKWatchDisplayProps extends React.HTMLAttributes<HTMLInputElement> {
    apiAction?: (value: any) => React.ReactNode;
}

type Props = NKWatchDisplayProps & NKFieldWrapperProps;

const NKWatchDisplay: React.FC<Props> = ({ name, isShow, label, labelClassName, apiAction, ...rest }) => {
    const formMethods = useFormContext();
    const watchValue = formMethods.watch(name);

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name}>
            {apiAction ? apiAction(watchValue) : <div {...rest}>{watchValue}</div>}
        </NKFieldWrapper>
    );
};

export default NKWatchDisplay;
