import * as React from 'react';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { kebabCase } from 'lodash';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { FormBuilderItem } from './FormBuilder';
import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';
import NKForm, { FieldProps } from './NKForm';

export interface FormBuilderArrayItem extends FormBuilderItem {}

type BuilderArrayItem = FormBuilderArrayItem & FieldProps;

export interface NKArrayFieldProps {
    fields: BuilderArrayItem[];
    defaultValues: any;

    addFieldLabel?: string;
    deleteFieldLabel?: string;
    isAllowAddField?: (value: any, methods: any, name: string) => boolean;
    isAllowDeleteField?: (value: any, methods: any, name: string) => boolean;
    onExtraOnAddField?: (value: any, methods: any, name: string) => void;
    onExtraOnRemoveField?: (value: any, methods: any, name: string) => void;
    onExtraItemFieldShow?: (currentField: any, methods: any, name: string) => React.ReactNode;
}

type Props = NKArrayFieldProps & NKFieldWrapperProps;

const NKArrayField: React.FC<Props> = ({
    name,
    isShow = true,
    label,
    labelClassName,
    defaultValues = true,
    deleteFieldLabel,
    addFieldLabel,
    isAllowAddField,
    isAllowDeleteField,
    onExtraOnAddField,
    onExtraOnRemoveField,
    onExtraItemFieldShow,
    ...rest
}) => {
    const formMethods = useFormContext();
    const watchValue = formMethods.watch();

    const [isCanAddField, setIsCanAddField] = React.useState(true);
    const [isEditField, setIsEditField] = React.useState(true);
    const formArrayMethods = useFieldArray({ control: formMethods.control, name });

    const watchArray = useWatch({ name: name, control: formMethods.control });

    const handleOnAddField = () => {
        formArrayMethods.append(defaultValues);
    };

    const handleOnRemoveField = (index: number) => {
        formArrayMethods.remove(index);
    };

    React.useEffect(() => {
        if (isAllowAddField) {
            const isAllow = isAllowAddField(watchValue, formMethods, name);

            setIsCanAddField(isAllow);
        }

        if (isAllowDeleteField) {
            const isAllow = isAllowDeleteField(watchValue, formMethods, name);

            setIsEditField(isAllow);
        }
    }, [watchValue, isAllowAddField, isAllowDeleteField]);

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name}>
            <div className="flex flex-col gap-4">
                {formArrayMethods.fields.map((field: any, index: number) => {
                    return (
                        <div key={field.id} className="border border-dashed border-tango-500 p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-bold text-gray-600">{`#${label} ${index + 1}`}</div>
                                {isEditField && (
                                    <Button
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            handleOnRemoveField(index);
                                            onExtraOnRemoveField && onExtraOnRemoveField(watchValue, formMethods, name);
                                        }}
                                        danger
                                        size="small"
                                    >
                                        {deleteFieldLabel}
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {rest.fields.map(({ label, name: keyName, type, fieldProps, span, ...rest }, subIndex) => {
                                    const subName = `${name}[${index}].${keyName}`;

                                    return (
                                        <div key={kebabCase(`${name}-${index}-${subName}-${subIndex}`)} className={`col-span-${span || 4} fade-in`}>
                                            <NKForm label={label} type={type} name={subName} fieldProps={fieldProps as any} {...rest} />
                                        </div>
                                    );
                                })}
                            </div>
                            {onExtraItemFieldShow && onExtraItemFieldShow(watchArray[index], formMethods, name)}
                        </div>
                    );
                })}

                {isCanAddField && (
                    <div className="col-span-4 flex items-center justify-center border border-dashed border-tango-500 p-4">
                        <div className="">
                            <Button
                                type="primary"
                                onClick={() => {
                                    handleOnAddField();
                                    onExtraOnAddField && onExtraOnAddField(watchValue, formMethods, name);
                                }}
                                icon={<PlusOutlined />}
                                className="mb-2 "
                                size="small"
                            >
                                {addFieldLabel}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </NKFieldWrapper>
    );
};

export default NKArrayField;
