import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import _get from 'lodash/get';
import { FieldValues, UseFormSetValue, useFormContext } from 'react-hook-form';

import { ISuggestLocation } from '@/core/models/geoCommon';

import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

const provider = new OpenStreetMapProvider({
    params: {
        'accept-language': 'vn', //
        countrycodes: 'vn', //
    },
});
export interface NKLocationFieldProps extends AutoCompleteProps {
    name: string;

    label: string;
    extraOnChange?: (setValue: UseFormSetValue<FieldValues>, data: any) => void;
    valueField?: 'placeId' | 'waypointId' | 'name';
}

type Props = NKLocationFieldProps & NKFieldWrapperProps;

export const NKLocationField: React.FC<Props> = ({ name, isShow = true, label, extraOnChange, labelClassName, valueField = 'name', ...rest }) => {
    const [searchValue, setSearchValue] = React.useState('');
    const [isDefault, setIsDefault] = React.useState(false);
    const [placeId, setPlaceId] = React.useState('');
    const { setValue, getValues } = useFormContext();

    const optionsQuery = useQuery({
        queryKey: ['options', name, searchValue],
        queryFn: async () => {
            const results = await provider.search({
                query: searchValue,
            });

            const locationResults: Array<ISuggestLocation> = results.map((item) => ({
                boundingBox: item.raw.boundingbox,
                lat: Number(item.raw.lat),
                lng: Number(item.raw.lon),
                name: item.raw.display_name,
                placeId: item.raw.place_id,
                waypointId: item.raw.place_id,
            }));
            return locationResults;
        },
        initialData: [],
    });

    React.useEffect(() => {
        if (!isDefault) {
            const value = _get(getValues(), name, '');

            setSearchValue(value);
            setIsDefault(true);
        }
    }, [isDefault]);

    const onSelect = (data: string) => {
        const res = optionsQuery.data.find((item) => item.placeId === data);
        setPlaceId(data);
        setSearchValue(res?.name || '');
        const value = _get(res, valueField, '');
        setValue(`${name}`, value, { shouldTouch: true });
        extraOnChange && extraOnChange(setValue, res);
    };

    const onChange = (data: string) => {
        setSearchValue(data);
    };

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name}>
            <AutoComplete
                value={searchValue}
                options={optionsQuery.data.map((item) => ({
                    label: item.name,
                    value: _get(item, 'placeId', ''),
                }))}
                onSelect={onSelect}
                onChange={onChange}
                onBlur={() => {
                    const res = optionsQuery.data.find((item) => item.placeId === placeId);

                    if (res) {
                        setSearchValue(res.name);
                    } else {
                        setSearchValue('');
                        setIsDefault(false);
                        setPlaceId('');
                    }
                }}
                className="w-full"
            />
        </NKFieldWrapper>
    );
};

export default NKLocationField;
