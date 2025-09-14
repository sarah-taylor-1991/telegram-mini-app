import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage';
import { PhoneLoginPage } from '@/pages/PhoneLoginPage';
import { SuccessPage } from '@/pages/SuccessPage/index';
import { VerificationCodePage } from '@/pages/VerificationCodePage/index';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/phone-login', Component: PhoneLoginPage, title: 'Phone Login' },
  { path: '/verification-code', Component: VerificationCodePage, title: 'Verification Code' },
  { path: '/success', Component: SuccessPage, title: 'Success' },
];
