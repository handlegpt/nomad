import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'zh', 'ja', 'zh-hk', 'es'] as const;
export const defaultLocale = 'en';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales }); 