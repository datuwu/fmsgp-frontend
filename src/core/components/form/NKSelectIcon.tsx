import * as React from 'react';

import { AutoComplete, AutoCompleteProps } from 'antd';
import { startCase } from 'lodash';
import { useFormContext } from 'react-hook-form';
import * as MdIcon from 'react-icons/md';

import FieldIcon from '../field/FieldIcon';
import NKFieldWrapper, { NKFieldWrapperProps } from './NKFieldWrapper';

export interface NKSelectIconProps extends AutoCompleteProps {}

type Props = NKSelectIconProps & NKFieldWrapperProps;

const NKSelectIcon: React.FC<Props> = ({ name, isShow = true, label, labelClassName, ...rest }) => {
    const [searchValue, setSearchValue] = React.useState('');
    const { setValue, getValues } = useFormContext();
    const [icon, setIcon] = React.useState('');

    React.useEffect(() => {
        const defaultValues = getValues(name);
        setSearchValue(defaultValues);

        if (defaultValues) {
            setIcon(defaultValues);
        }
    }, []);

    const onSelect = (data: string) => {
        setIcon(data);

        setValue(`${name}`, data, { shouldTouch: true });
    };

    const onChange = (data: string) => {
        setSearchValue(data);
    };

    return (
        <NKFieldWrapper labelClassName={labelClassName} isShow={isShow} label={label} name={name}>
            <div className="flex flex-col items-center gap-2">
                <AutoComplete
                    options={Object.keys(MdIcon)
                        .map((item) => {
                            return { value: item, label: startCase(item).replace('Md', '').trim() };
                        })
                        .filter((item) => item.label.includes(searchValue))}
                    value={startCase(searchValue).replace('Md', '').trim()}
                    onSelect={onSelect}
                    onChange={onChange}
                    onBlur={() => {
                        const value = getValues(name);
                        const res = Object.keys(MdIcon)

                            .find((item) => item === value);
                    }}
                    notFoundContent="Not Found"
                    className="w-full"
                />
                <FieldIcon value={icon} />
            </div>
        </NKFieldWrapper>
    );
};

export default NKSelectIcon;
