import * as MdIcon from 'react-icons/md';

interface FieldIconProps {
    value: string;
}

const FieldIcon: React.FC<FieldIconProps> = ({ value }) => {
    const Icon = MdIcon[value as keyof typeof MdIcon];

    if (Icon) {
        return (
            <div className="flex items-center text-2xl">
                <Icon />
            </div>
        );
    }

    return null;
};

export default FieldIcon;
