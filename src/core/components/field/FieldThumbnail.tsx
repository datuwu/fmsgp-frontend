'use client';

import * as React from 'react';

import { PhotoProvider, PhotoView } from 'react-photo-view';

import FieldImage from './FieldImage';

interface FieldThumbnailProps {
    value: string;
}

const FieldThumbnail: React.FC<FieldThumbnailProps> = ({ value }) => {
    return (
        <div className="h-16 w-16">
            <PhotoProvider speed={() => 200} maskOpacity={0.7}>
                <PhotoView src={value}>
                    <FieldImage alt="Thumbnail" src={value} className="!h-full !w-full" />
                </PhotoView>
            </PhotoProvider>
        </div>
    );
};

export default FieldThumbnail;
