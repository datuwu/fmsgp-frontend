import * as React from 'react';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Upload, UploadProps } from 'antd';
import { CompoundedComponent } from 'antd/lib/float-button/interface';
import { Controller, useFormContext } from 'react-hook-form';
import { FaRegFile } from 'react-icons/fa';

import { uploadFileApi } from '@/core/api/upload-file.api';
import NKLink from '@/core/routing/components/NKLink';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKUploadFileProps extends UploadProps {}

type Props = NKUploadFileProps & NKFieldWrapperProps;

const NKUploadFile: React.FC<Props> = ({ label, name, isShow = true, labelClassName, ...rest }) => {
    const [fileUrl, setFileUrl] = React.useState<string>();
    const formMethods = useFormContext();

    React.useEffect(() => {
        if (!fileUrl) {
            const values = formMethods.getValues(name);
            if (values) {
                setFileUrl(values);
            }
        }
    }, [fileUrl]);

    const uploadMutation = useMutation({
        mutationFn: (file: File) => {
            return uploadFileApi.v1UploadFile(file);
        },
    });

    const uploadButton = (
        <div>
            {uploadMutation.isPending ? <LoadingOutlined rev="" /> : <PlusOutlined rev="" />}
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
                            const url = await uploadMutation.mutateAsync(file);
                            setFileUrl(url as string);
                            field.onChange(url);
                            return url;
                        }}
                    >
                        {fileUrl ? (
                            <div className="inline-flex border border-dashed border-gray-200 p-2 text-2xl">
                                <NKLink href={fileUrl} target="_blank">
                                    <FaRegFile />
                                </NKLink>
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

export default NKUploadFile;
