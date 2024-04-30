import * as React from 'react';

import { Input, InputProps, SwitchProps } from 'antd';
import { Switch } from 'antd/lib';
import { Controller, useFormContext } from 'react-hook-form';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKBooleanInputProps extends SwitchProps {}

type Props = NKBooleanInputProps & NKFieldWrapperProps;

const NKBooleanInput: React.FC<Props> = ({ name, isShow = true, label, labelClassName, ...rest }) => {
    const formMethods = useFormContext();

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name}>
            <div>
                <Controller
                    name={name}
                    control={formMethods.control}
                    render={({ field }) => <Switch {...field} checked={field.value} {...rest} className="" />}
                />
            </div>
        </NKFieldWrapper>
    );
};

export default NKBooleanInput;
