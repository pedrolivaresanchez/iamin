import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const resolvedSameSite =
              options?.sameSite === 'strict' || options?.sameSite === 'none'
                ? options.sameSite
                : 'lax'

            const mergedOptions = {
              path: options?.path ?? '/',
              sameSite: resolvedSameSite,
              secure: options?.secure ?? true,
              maxAge: options?.maxAge ?? 60 * 60 * 24 * 30, // keep session for 30 days
              expires: options?.expires,
              domain: options?.domain,
              httpOnly: options?.httpOnly,
              partitioned: options?.partitioned,
              priority: options?.priority,
            }

            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, mergedOptions)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
        },
      },
    },
  );

  return { supabase, supabaseResponse };
};

