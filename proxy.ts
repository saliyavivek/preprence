import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                },
            },
        },
    );

    let user = null;

    try {
        const result = await supabase.auth.getUser();
        user = result.data.user;
    } catch {
        request.cookies.getAll().forEach(({ name }) => {
            if (name.startsWith("sb-") && name.includes("auth-token")) {
                response.cookies.delete(name);
            }
        });
    }

    if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
        const loginResponse = NextResponse.redirect(loginUrl);
        response.cookies.getAll().forEach(({ name, value, ...options }) => {
            loginResponse.cookies.set(name, value, options);
        });
        return loginResponse;
    }

    return response;
}

export const config = {
    matcher: ["/experience/new", "/experience/:id/edit", "/dashboard/:path*", "/profile/:path*"],
};