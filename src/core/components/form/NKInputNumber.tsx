import * as React from 'react';

import { InputNumber, InputNumberProps } from 'antd';
import _ from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKInputNumberProps extends InputNumberProps {}

type Props = NKInputNumberProps & NKFieldWrapperProps;

const NKInputNumber: React.FC<Props> = ({ name, isShow, label, labelClassName, onChangeExtra, ...rest }) => {
    const formMethods = useFormContext();

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name} onChangeExtra={onChangeExtra}>
            <Controller
                name={name}
                control={formMethods.control}
                render={({ field }) => (
                    <InputNumber
                        {...field}
                        {...rest}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                        className="w-full"
                    />
                )}
            />
        </NKFieldWrapper>
    );
};

export default NKInputNumber;
