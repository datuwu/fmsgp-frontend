import React from 'react';

import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import joi from 'joi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

import { NKConstant } from '@/core/NKConstant';
import { ILoginUserDto, userApi } from '@/core/api/user.api';
import FieldImage from '@/core/components/field/FieldImage';
import NKFormWrapper from '@/core/components/form/NKFormWrapper';
import NKTextField from '@/core/components/form/NKTextField';
import UnAuthWrapper from '@/core/components/wrapper/UnAuthWrapper';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { store } from '@/core/store';
import { userActions } from '@/core/store/user';

const defaultValues: ILoginUserDto = {
    email: '',
    hashedPassword: '',
};

const Page: React.FunctionComponent = () => {
    const formMethods = useForm({
        defaultValues,

        resolver: joiResolver(
            joi.object({
                email: joi
                    .string()
                    .email({
                        tlds: { allow: false },
                    })
                    .required(),
                hashedPassword: joi.string().required(),
            }),
        ),
    });
    const authLoginMutation = useMutation({
        mutationFn: (data: ILoginUserDto) => {
            return userApi.login(data);
        },

        onSuccess: (data: any) => {
            const cookies = new Cookies();
            cookies.set(NKConstant.TOKEN_COOKIE_KEY, data.token, {
                path: '/',
            });
            setTimeout(() => {
                store.dispatch(userActions.setToken(data.token));
                window.location.reload();
            }, 1000);
        },
        onError: (error: any) => {
            toast.error('Username or password is incorrect');
        },
    });

    useDocumentTitle('Login');

    return (
        <UnAuthWrapper>
            <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[url('https://images.unsplash.com/photo-1451930309178-fc8e1f80ad68?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover">
                <NKFormWrapper formMethods={formMethods} formActionError={authLoginMutation.error}>
                    <form
                        className="fade-in flex w-96 flex-col rounded-lg bg-white px-8 py-16"
                        onSubmit={formMethods.handleSubmit((data) => {
                            authLoginMutation.mutate(data);
                        })}
                    >
                        <div className="flex items-center justify-center">
                            <div className="h-16 w-16">
                                <FieldImage src="/assets/images/logo.png" className="h-full w-full" />
                            </div>
                        </div>
                        <div className="mb-4 flex-1 text-center text-lg font-semibold text-black">Login Account</div>
                        <div className="flex w-full flex-col gap-4">
                            <NKTextField name="email" label="Email" placeholder="Email" />
                            <NKTextField name="hashedPassword" label="Password" placeholder="Password" type="password" />
                            <Button htmlType="submit" type="primary" loading={authLoginMutation.isPending}>
                                Sign In
                            </Button>
                        </div>
                    </form>
                </NKFormWrapper>{' '}
                <p className="text-center text-sm text-gray-600">Copyright © FMS-GP 2024.</p>
            </div>
        </UnAuthWrapper>
    );
};

export const Route = createFileRoute('/')({
    component: Page,
});
