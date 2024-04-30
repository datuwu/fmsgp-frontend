import * as React from 'react';

import { Input, InputProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKTextFieldProps extends InputProps {}

type Props = NKTextFieldProps & NKFieldWrapperProps;

const NKTextField: React.FC<Props> = ({ name, isShow, label, labelClassName, ...rest }) => {
    const formMethods = useFormContext();

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name}>
            <Controller name={name} control={formMethods.control} render={({ field }) => <Input {...field} {...rest} className="w-full" />} />
        </NKFieldWrapper>
    );
};

export default NKTextField;
