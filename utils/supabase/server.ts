import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const resolvedSameSite: 'lax' | 'strict' | 'none' | undefined =
                options?.sameSite === 'strict' || options?.sameSite === 'none'
                  ? options.sameSite
                  : 'lax'

              const mergedOptions: {
                path?: string
                sameSite?: 'lax' | 'strict' | 'none'
                secure?: boolean
                maxAge?: number
                expires?: Date
                domain?: string
                httpOnly?: boolean
                partitioned?: boolean
                priority?: 'low' | 'medium' | 'high'
              } = {
                path: options?.path ?? '/',
                sameSite: resolvedSameSite,
                secure: options?.secure ?? true,
                maxAge: options?.maxAge ?? 60 * 60 * 24 * 365, // 1 year
                expires: options?.expires,
                domain: options?.domain,
                httpOnly: options?.httpOnly,
                partitioned: options?.partitioned,
                priority: options?.priority,
              }

              cookieStore.set(name, value, mergedOptions)
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
