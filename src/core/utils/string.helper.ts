export const getRootPath = (path: string): string => {
    const subPaths = path.split('.');
    subPaths.pop();
    return subPaths.join('.');
};

function decodeRFC5987Value(encoded: string) {
    const charsetEnd = encoded.indexOf("'") || encoded.length;
    const encodedText = encoded.substring(charsetEnd + 1);

    return decodeURIComponent(encodedText.replace(/\+/g, ' '));
}

export function getFilenameFromResponseHeaders(headers: any) {
    const contentDisposition = headers.get('content-disposition');
    if (contentDisposition) {
        const matches = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;'"]+)/i);
        if (matches && matches.length > 1) {
            const encodedFilename = matches[1];
            return decodeRFC5987Value(encodedFilename);
        }
    }
    // If filename is not found in headers, return a default name or handle as needed
    return 'unknown_filename';
}
