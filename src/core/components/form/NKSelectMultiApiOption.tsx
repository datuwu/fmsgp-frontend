import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { TrashBin } from 'akar-icons';
import { AutoComplete, AutoCompleteProps } from 'antd';
import _get from 'lodash/get';
import { useFormContext } from 'react-hook-form';

import { getColorWithUuId } from '@/core/utils/api.helper';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKSelectMultiApiOptionProps extends AutoCompleteProps {
    apiAction: (value: string) => Promise<any[]>;
}

type Props = NKSelectMultiApiOptionProps & NKFieldWrapperProps;

const NKSelectMultiApiOption: React.FC<Props> = ({ name, isShow = true, label, labelClassName, onChangeExtra, ...rest }) => {
    const [searchValue, setSearchValue] = React.useState('');
    const [isDefault, setIsDefault] = React.useState(false);
    const { setValue, getValues, watch } = useFormContext();
    const values = (watch(name) || []) as string[];
    const optionsQuery = useQuery({
        queryKey: ['options', name, searchValue],
        queryFn: async () => {
            const res = await (rest.apiAction ? rest.apiAction(searchValue) : Promise.resolve([]));

            return res;
        },
        initialData: [],
    });

    const onSelect = (data: string) => {
        const res = optionsQuery.data.find((item) => item.id === data);
        const value = getValues(name) || [];
        setSearchValue('');
        setValue(`${name}`, [...value, data], { shouldTouch: true });
    };

    const onChange = (data: string) => {
        setSearchValue(data);
    };

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name} onChangeExtra={onChangeExtra}>
            <AutoComplete
                value={searchValue}
                options={optionsQuery.data

                    .filter((item) => !values.includes(item.id))
                    .map((item) => ({
                        label: _get(item, 'label.vi', item.name),
                        value: item.id,
                    }))}
                onSelect={onSelect}
                onChange={onChange}
                onBlur={() => {
                    const res = optionsQuery.data.find((item) => item.name === searchValue);

                    if (res) {
                        setSearchValue(res.name);
                    } else {
                        setSearchValue('');
                        setIsDefault(false);
                    }
                }}
                className="w-full"
            />
            <div className="mt-1 flex flex-wrap gap-2">
                {values.map((value, index) => {
                    const res = optionsQuery.data.find((item) => item.id === value);
                    return (
                        <div
                            key={index}
                            className="flex  items-center gap-2 rounded-lg p-2 font-medium text-white"
                            style={{
                                background: getColorWithUuId(value),
                            }}
                        >
                            <span>{_get(res, 'label.vi', res?.name || '')}</span>
                            <span
                                onClick={() => {
                                    const newValues = values.filter((item) => item !== value);
                                    setValue(name, newValues);
                                }}
                                className="flex cursor-pointer items-center justify-center rounded-lg bg-white p-1 text-sm text-red-600 duration-300 hover:bg-red-600 hover:text-white"
                            >
                                <TrashBin size={14} />
                            </span>
                        </div>
                    );
                })}
            </div>
        </NKFieldWrapper>
    );
};

export default NKSelectMultiApiOption;
