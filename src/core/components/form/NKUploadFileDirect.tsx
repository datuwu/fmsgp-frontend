import * as React from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Upload, UploadProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import { FaRegFile } from 'react-icons/fa';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKUploadFileDirectProps extends UploadProps {}

type Props = NKUploadFileDirectProps & NKFieldWrapperProps;

const NKUploadFileDirect: React.FC<Props> = ({ label, name, isShow = true, labelClassName, ...rest }) => {
    const formMethods = useFormContext();
    const value = formMethods.watch(name);

    const uploadButton = (
        <div>
            <PlusOutlined rev="" />
            <div style={{ marginTop: 8 }}>Tải Lên</div>
        </div>
    );

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name}>
            <Controller
                name={name}
                control={formMethods.control}
                render={({ field }) => (
                    <Upload
                        name={field.name}
                        listType="picture-card"
                        showUploadList={false}
                        {...rest}
                        action={async (file) => {
                            field.onChange(file);

                            return '';
                        }}
                    >
                        {Boolean(value) ? (
                            <div className="inline-flex border border-dashed border-gray-200 p-2 text-2xl">
                                <FaRegFile />
                            </div>
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                )}
            />
        </NKFieldWrapper>
    );
};

export default NKUploadFileDirect;
