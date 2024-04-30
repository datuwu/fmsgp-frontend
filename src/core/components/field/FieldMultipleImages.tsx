import * as React from 'react';

import { PhotoProvider, PhotoView } from 'react-photo-view';

import FieldImage from './FieldImage';

interface FiledMultipleImageProps {
    value: string[];
}

const FiledMultipleImage: React.FC<FiledMultipleImageProps> = ({ value }) => {
    return (
        <div className="flex max-w-2xl flex-wrap gap-4">
            <PhotoProvider speed={() => 200} maskOpacity={0.7}>
                {value.map((image, index) => (
                    <div key={index} className="relative inline-block h-[100px] w-[100px]">
                        <PhotoView src={image} key={index}>
                            <FieldImage src={image} alt={`${image}`} className="h-full w-full" />
                        </PhotoView>
                    </div>
                ))}
            </PhotoProvider>
        </div>
    );
};

export default FiledMultipleImage;
