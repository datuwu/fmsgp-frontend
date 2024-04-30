import axios from 'axios';

import http from './http';

export const uploadFileApi = {
    v1UploadFile: async (file: File | Blob) => {
        const url = 'https://api.monoinfinity.net/api/v1/upload-file/upload';
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post<any>(url, formData, {
            headers: {
                Authorization: `Bearer 31a666c5-5c87-f1e2-42ab-10f357b29b61`,
            },
        });
        return res.data.fileLocation;
    },
};
