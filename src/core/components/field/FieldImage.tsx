import React, { useState } from 'react';

import { Spin } from 'antd';
import { Skeleton } from 'antd';

interface FieldImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const FieldImage: React.FC<FieldImageProps> = ({ className, ...rest }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setIsError(true);
    };

    return (
        <>
            <img {...rest} className={className} onLoad={handleLoad} onError={handleError} style={{ display: isLoaded ? 'block' : 'none' }} />
            {(!isLoaded || isError) && (
                <div className="flex h-full w-full items-center justify-center">
                    <Spin />
                </div>
            )}
        </>
    );
};

export default FieldImage;
