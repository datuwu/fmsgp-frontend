export const NKConstant = {
    LOCAL_STORAGE_KEY: 'app' as const,
    SUPPORTED_LOCALES: ['en', 'vi'] as const,
    FALLBACK_LOCALE: 'en' as const,
    TOKEN_COOKIE_KEY: 'token' as const,
    TOKEN_HEADER_KEY: 'Authorization' as const,
    APP_NAME: 'MPMS' as const,
    AUTH_FAILED_FALLBACK_ROUTE: '/' as const,
    AUTH_SUCCESS_FALLBACK_ROUTE: '/dashboard/raw-material' as const,
    AUTH_EXPERT_FAILED_FALLBACK_ROUTE: '/expert' as const,
    AUTH_EXPERT_SUCCESS_FALLBACK_ROUTE: '/expert/dashboard' as const,
    MESSAGE_FORMAT: {
        'string.base': 'là một chuỗi kí tự',
        'string.min': 'sử dụng {#limit} ký tự trở lên',
        'string.max': 'sử dụng {#limit} ký tự trở xuống',
        'string.alphanum': 'bao gồm cả chữ và số',
        'string.email': 'email không hợp lệ',
        'string.pattern.base': 'theo mẫu',
        'number.base': 'là chữ số',
        'number.min': 'sử dụng số lớn hơn hoặc bằng {#limit}',
        'number.max': 'sử dụng số bé hơn hoặc bằng {#limit}',
        'any.required': 'bắt buộc',
        'any.only': 'không chính xác',
        'string.empty': 'trống',
        'date.base': 'ngày tháng không hợp lệ',
        'boolean.base': 'đúng hoặc sai',
        'array.length': 'số kí tự phải bằng {#limit}',
        'password.minOfUppercase': 'phải có ít nhất 1 chữ cái viết hoa',
        'password.minOfLowercase': 'phải có ít nhất 1 chữ cái viết thường',
        'password.minOfNumeric': 'phải có ít nhất 1 chữ số',
        'object.unknown': 'object.unknown',
    },
};
