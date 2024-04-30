import * as React from 'react';

import _ from 'lodash';

import NKArrayField, { NKArrayFieldProps } from './NKArrayField';
import NKBooleanInput, { NKBooleanInputProps } from './NKBooleanInput';
import NKDatePicker, { NKDatePickerProps } from './NKDatePicker';
import { NKFieldWrapperProps } from './NKFieldWrapper';
import NKInputNumber, { NKInputNumberProps } from './NKInputNumber';
import { NKLocationFieldProps } from './NKLocationField';
import NKRichText, { NKRichTextProps } from './NKRichText';
import NKSelectApiOption, { NKSelectApiOptionProps } from './NKSelectApiOption';
import NKSelectIcon, { NKSelectIconProps } from './NKSelectIcon';
import NKSelectMultiApiOption, { NKSelectMultiApiOptionProps } from './NKSelectMultiApiOption';
import NKTextField, { NKTextFieldProps } from './NKTextField';
import NKTextareaField, { NKTextAreaFieldProps } from './NKTextareaField';
import NKUploadFile, { NKUploadFileProps } from './NKUploadFile';
import NKUploadFileDirect, { NKUploadFileDirectProps } from './NKUploadFileDirect';
import NKUploadImage, { NKUploadImageProps } from './NKUploadImage';
import NKUploadMultipleImage, { NKUploadMultipleImageProps } from './NKUploadMultipleImage';
import NKWatchDisplay, { NKWatchDisplayProps } from './NKWatchDisplay';

export enum NKFormType {
    TEXT = 'text',
    ARRAY = 'array',
    PASSWORD = 'password',
    TEXTAREA = 'textarea',
    DATE = 'date',
    DATE_TIME = 'date_time',
    DATE_WEEK = 'date_week',
    DATE_MONTH = 'date_month',
    DATE_QUARTER = 'date_quarter',
    DATE_YEAR = 'date_year',
    SELECT_API_OPTION = 'select_api_option',
    SELECT_MULTI_API_OPTION = 'select_multi_api_option',
    SELECT_ICON = 'select_icon',
    UPLOAD_IMAGE = 'upload_image',
    UPLOAD_FILE = 'upload_file',
    UPLOAD_FILE_DIRECT = 'upload_file_direct',
    MULTI_UPLOAD_IMAGE = 'multi_upload_image',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    RICH_TEXT = 'rich_text',
    WATCH_DISPLAY = 'watch_display',
    LOCATION_NAME = 'location_name',
    LOCATION_PLACE = 'location_place',
    CUSTOM = 'custom',
}

export type FieldProps = NKFieldWrapperProps &
    (
        | NKFieldsProps<NKFormType.TEXT, NKTextFieldProps>
        | NKFieldsProps<NKFormType.PASSWORD, NKTextFieldProps>
        | NKFieldsProps<NKFormType.TEXTAREA, NKTextAreaFieldProps>
        | NKFieldsProps<NKFormType.DATE, NKDatePickerProps>
        | NKFieldsProps<NKFormType.DATE_TIME, NKDatePickerProps>
        | NKFieldsProps<NKFormType.DATE_WEEK, NKDatePickerProps>
        | NKFieldsProps<NKFormType.DATE_MONTH, NKDatePickerProps>
        | NKFieldsProps<NKFormType.DATE_QUARTER, NKDatePickerProps>
        | NKFieldsProps<NKFormType.DATE_YEAR, NKDatePickerProps>
        | NKRequireFieldsProps<NKFormType.SELECT_API_OPTION, NKSelectApiOptionProps>
        | NKFieldsProps<NKFormType.UPLOAD_IMAGE, NKUploadImageProps>
        | NKFieldsProps<NKFormType.MULTI_UPLOAD_IMAGE, NKUploadMultipleImageProps>
        | NKFieldsProps<NKFormType.NUMBER, NKInputNumberProps>
        | NKFieldsProps<NKFormType.BOOLEAN, NKBooleanInputProps>
        | NKFieldsProps<NKFormType.WATCH_DISPLAY, NKWatchDisplayProps>
        | NKFieldsProps<NKFormType.RICH_TEXT, NKRichTextProps>
        | NKFieldsProps<NKFormType.SELECT_ICON, NKSelectIconProps>
        | NKRequireFieldsProps<NKFormType.SELECT_MULTI_API_OPTION, NKSelectMultiApiOptionProps>
        | NKFieldsProps<NKFormType.LOCATION_NAME, NKLocationFieldProps>
        | NKFieldsProps<NKFormType.LOCATION_PLACE, NKLocationFieldProps>
        | NKFieldsProps<NKFormType.UPLOAD_FILE, NKUploadFileProps>
        | NKFieldsProps<NKFormType.ARRAY, NKArrayFieldProps>
        | NKFieldsProps<NKFormType.UPLOAD_FILE_DIRECT, NKUploadFileDirectProps>
        | NKFieldsProps<NKFormType.CUSTOM, any>
    );

interface NKFieldsProps<Type, IField> {
    type: Type;
    fieldProps?: IField;
}

interface NKRequireFieldsProps<Type, IField> {
    type: Type;
    fieldProps: IField;
}

const NKForm: React.FC<FieldProps> = ({ label, name, type, fieldProps, ...rest }) => {
    switch (type) {
        case NKFormType.TEXT:
            return <NKTextField name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.TEXTAREA:
            return <NKTextareaField name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.PASSWORD:
            return <NKTextField name={name} label={label} type={'password'} {...fieldProps} {...rest} />;
        case NKFormType.DATE:
            return <NKDatePicker name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.DATE_TIME:
            return <NKDatePicker name={name} label={label} showTime {...fieldProps} {...rest} />;
        case NKFormType.DATE_WEEK:
            return <NKDatePicker name={name} label={label} picker="week" {...fieldProps} {...rest} />;
        case NKFormType.DATE_MONTH:
            return <NKDatePicker name={name} label={label} picker="month" {...fieldProps} {...rest} />;
        case NKFormType.DATE_QUARTER:
            return <NKDatePicker name={name} label={label} picker="quarter" {...fieldProps} {...rest} />;
        case NKFormType.DATE_YEAR:
            return <NKDatePicker name={name} label={label} picker="year" {...fieldProps} {...rest} />;
        case NKFormType.UPLOAD_IMAGE:
            return <NKUploadImage name={name} label={label} maxCount={1} {...fieldProps} {...rest} />;
        case NKFormType.NUMBER:
            return <NKInputNumber name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.MULTI_UPLOAD_IMAGE:
            return <NKUploadMultipleImage name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.BOOLEAN:
            return <NKBooleanInput name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.RICH_TEXT:
            return <NKRichText name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.WATCH_DISPLAY:
            return <NKWatchDisplay name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.SELECT_API_OPTION:
            return <NKSelectApiOption name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.SELECT_ICON:
            return <NKSelectIcon name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.UPLOAD_FILE:
            return <NKUploadFile name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.UPLOAD_FILE_DIRECT:
            return <NKUploadFileDirect name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.SELECT_MULTI_API_OPTION:
            return <NKSelectMultiApiOption name={name} label={label} {...fieldProps} {...rest} />;
        case NKFormType.CUSTOM:
            return fieldProps.apiAction ? fieldProps.apiAction() : null;
        case NKFormType.ARRAY:
            return (
                <NKArrayField
                    defaultValues={fieldProps?.defaultValues || {}}
                    fields={fieldProps?.fields || []}
                    name={name}
                    label={label}
                    {...fieldProps}
                />
            );

        default:
            return <NKTextField name={name} label={label} {...(fieldProps as any)} {...rest} />;
    }
};

export default NKForm;
