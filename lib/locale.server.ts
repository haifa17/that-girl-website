import 'server-only'
import { cookies } from 'next/headers'
import { LOCALE_COOKIE, Locale } from './shop'

/** Used by app/layout.tsx (<html lang>) and app/page.tsx. */
export async function getLocale(): Promise<Locale> {
    return (await cookies()).get(LOCALE_COOKIE)?.value === 'fr' ? 'fr' : 'en'
}