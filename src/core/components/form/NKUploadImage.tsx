import * as React from 'react';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Upload, UploadProps } from 'antd';
import { CompoundedComponent } from 'antd/lib/float-button/interface';
import { Controller, useFormContext } from 'react-hook-form';

import { uploadFileApi } from '@/core/api/upload-file.api';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKUploadImageProps extends UploadProps {}

type Props = NKUploadImageProps & NKFieldWrapperProps;

const NKUploadImage: React.FC<Props> = ({ label, name, isShow = true, labelClassName, ...rest }) => {
    const [imageUrl, setImageUrl] = React.useState<string>();
    const formMethods = useFormContext();

    React.useEffect(() => {
        if (!imageUrl) {
            const values = formMethods.getValues(name);
            if (values) {
                setImageUrl(values);
            }
        }
    }, [imageUrl]);

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
                            setImageUrl(url as string);
                            field.onChange(url);
                            return url;
                        }}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" className="h-full w-full" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                )}
            />
        </NKFieldWrapper>
    );
};

export default NKUploadImage;
