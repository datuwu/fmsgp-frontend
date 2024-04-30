import { UserRole } from '../models/userRole';
import http from './http';

export interface ICreateRoleDto extends Pick<UserRole, 'name' | 'description'> {}
export interface IUpdateRoleDto extends Pick<UserRole, 'id' | 'name' | 'description'> {}

const baseUrl = '/Role';

export const roleApi = {
    getAll: async () => {
        const { data } = await http.get<UserRole[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<UserRole>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (role: ICreateRoleDto) => {
        const { data } = await http.post<UserRole>(baseUrl, role);

        return data;
    },
    update: async (role: IUpdateRoleDto) => {
        const { data } = await http.put<UserRole>(baseUrl, role);

        return data;
    },
};
