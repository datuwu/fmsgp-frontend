import * as React from 'react';

import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import clsx from 'clsx';
import joi from 'joi';
import { kebabCase } from 'lodash';
import { useForm } from 'react-hook-form';

import NKForm, { FieldProps, NKFormType } from './NKForm';
import NKFormWrapper from './NKFormWrapper';

export interface FormBuilderItem {
    name: string;
    label: string;
    type: NKFormType;
    span?: 1 | 2 | 3 | 4;
    isShowField?: (value: any) => boolean;
    useAction?: (value: any) => any;
}

type BuilderItem = FormBuilderItem & FieldProps;

export interface FormBuilderProps<T> {
    title: string;
    apiAction: (value: T) => any;
    fields: BuilderItem[];
    defaultValues: T;
    schema: Record<keyof T, joi.AnySchema>;
    btnLabel?: string;
    onExtraSuccessAction?: (data: any) => void;
    onExtraErrorAction?: (error: any) => void;
    beforeSubmit?: (value: T) => boolean;
    isDebug?: boolean;
    className?: string;
}

const FormBuilder = <T,>({
    fields,
    title,
    apiAction,
    schema,
    defaultValues,
    onExtraSuccessAction,
    onExtraErrorAction,
    btnLabel = 'Submit',
    isDebug,
    className,
    beforeSubmit,
}: FormBuilderProps<T>) => {
    const formMethods = useForm<any>({
        defaultValues,
        resolver: joiResolver(
            joi.object(schema).options({
                messages: {
                    'string.base': 'should be a type of text',
                    'string.empty': 'should not be empty',
                    'string.min': 'should have a minimum length of {#limit}',
                    'string.max': 'should have a maximum length of {#limit}',
                    'any.required': 'is required',
                    'string.email': 'should be a valid email',
                    'string.pattern.base': 'should be a valid {#name}',
                    'number.base': 'should be a type of number',
                    'number.min': 'should be greater than or equal to {#limit}',
                    'number.max': 'should be less than or equal to {#limit}',
                    'number.integer': 'should be a type of integer',
                    'array.base': 'should be a type of array',
                    'array.min': 'should have a minimum length of {#limit}',
                    'array.max': 'should have a maximum length of {#limit}',
                },
            }),
        ),
    });
    const watchValues = formMethods.watch();

    const mutate = useMutation({
        mutationFn: apiAction,
        onSuccess: (data: any) => {
            onExtraSuccessAction?.(data);
        },
        onError: (error: any) => {
            onExtraErrorAction?.(error);
        },
    });

    React.useEffect(() => {
        if (isDebug) {
            console.log('FormBuilder', formMethods.getValues());
            console.log('FormBuilder', formMethods.formState.errors);
        }
    }, [formMethods.getValues()]);

    return (
        <form
            className={clsx('fade-in flex flex-col gap-4 rounded-lg bg-white p-4', className)}
            onSubmit={formMethods.handleSubmit((value) => {
                if (beforeSubmit && !beforeSubmit(value)) {
                    return;
                }

                mutate.mutate(value);
            })}
        >
            {Boolean(title) && (
                <div className="text-xl font-bold">
                    {title}
                    <div className="sr-only col-span-1"></div>
                    <div className="sr-only col-span-2"></div>
                    <div className="sr-only col-span-3"></div>
                    <div className="sr-only col-span-4"></div>
                </div>
            )}
            <NKFormWrapper formMethods={formMethods} formActionError={mutate.error}>
                <div className="grid grid-cols-4 gap-4">
                    {fields
                        .filter((item) => (item.isShowField ? item.isShowField(watchValues) : true))
                        .map(({ name, label, type, fieldProps, span, ...rest }) => {
                            return (
                                <div key={kebabCase(`${name}-${label}`)} className={`col-span-${span || 4} `}>
                                    <NKForm label={label} name={name} type={type} fieldProps={fieldProps as any} {...rest} />
                                </div>
                            );
                        })}
                </div>
            </NKFormWrapper>
            <Button type="primary" htmlType="submit" loading={mutate.isPending}>
                {btnLabel}
            </Button>
        </form>
    );
};

export default FormBuilder;
