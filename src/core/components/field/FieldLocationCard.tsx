import * as React from 'react';

interface FieldLocationCardProps {
    value: string;
}

const FieldLocationCard: React.FC<FieldLocationCardProps> = ({ value }) => {
    const [addressMap, setAddressMap] = React.useState<string>('');

    React.useEffect(() => {
        if (value) {
            const addressUrl = 'https://maps.google.com/maps?width=430&height=490&hl=en&q=' + value + '&t=&z=14&amp;ie=UTF8&iwloc=B&output=embed';
            setAddressMap(addressUrl);
        }
    }, [value]);

    return (
        <div className="flex w-full flex-col rounded-md border border-solid border-gray-200">
            <div className="flex flex-col  text-sm leading-5">
                {Boolean(addressMap) && (
                    <div className=" h-[120px]  w-full flex-shrink-0 overflow-hidden ">
                        <div className="mapouter w-full">
                            <div className="gmap_canvas w-full">
                                <iframe className="gmap_iframe w-full" src={addressMap}></iframe>
                            </div>
                            <style
                                dangerouslySetInnerHTML={{
                                    __html: `.mapouter{position:relative;text-align:right;width:100%;height:120px;}.gmap_canvas {overflow:hidden;background:none!important;width:100%;height:120px;}.gmap_iframe {width:100%!important;height:120px!important;}`,
                                }}
                            ></style>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-1 p-2">
                    <div className="text-xs text-gray-500">{value}</div>
                </div>
            </div>
        </div>
    );
};

export default FieldLocationCard;
