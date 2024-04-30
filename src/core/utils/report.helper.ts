import moment from 'moment';

import { ReportResponse } from '../models/common';

export const groupCountValueByDate = (data: ReportResponse[]): Record<string, number> => {
    const result: any = {};
    data.forEach((item) => {
        const date = moment(item.time).format('YYYY-MM-DD');
        if (result[date]) {
            result[date] += 1;
        } else {
            result[date] = 1;
        }
    });
    return result;
};

export const groupSumValueByDate = (data: ReportResponse[]): Record<string, number> => {
    const result: any = {};
    data.forEach((item) => {
        const date = moment(item.time).format('YYYY-MM-DD');
        if (result[date]) {
            result[date] += item.value;
        } else {
            result[date] = item.value;
        }
    });
    return result;
};

export const groupCountValueByMonth = (data: ReportResponse[]): Record<string, number> => {
    const result: any = {};
    data.sort((a, b) => moment(a.time).diff(moment(b.time))).forEach((item) => {
        const date = moment(item.time).format('YYYY-MM');
        if (result[date]) {
            result[date] += 1;
        } else {
            result[date] = 1;
        }
    });
    return result;
};
