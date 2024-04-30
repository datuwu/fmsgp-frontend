import * as React from 'react';

import _get from 'lodash/get';
import { HiOutlineLocationMarker } from 'react-icons/hi';

interface AddressCardProps {
    address: string;
}

const AddressCard: React.FC<AddressCardProps> = ({ address }) => {
    const [addressMap, setAddressMap] = React.useState<string>('');

    React.useEffect(() => {
        if (address) {
            const addressUrl = 'https://maps.google.com/maps?width=430&height=490&hl=en&q=' + address + '&t=&z=14&amp;ie=UTF8&iwloc=B&output=embed';
            setAddressMap(addressUrl);
        }
    }, [address]);

    return (
        <div className="flex w-full flex-col rounded-md border border-solid border-gray-200">
            <div className="flex flex-col-reverse justify-between gap-x-4 gap-y-2 bg-gray-50 p-6 font-medium md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-4">
                    <div>
                        <div className="flex items-center justify-center rounded-lg border border-gray-200 p-3">
                            <HiOutlineLocationMarker className="h-6 w-6 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex flex-col text-sm leading-5 text-gray-900 ">
                        <span>{_get(address, 'street')}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col px-6 py-3 text-sm leading-5">
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
            </div>
        </div>
    );
};

export default AddressCard;
