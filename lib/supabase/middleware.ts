import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPrivateRoute, requiredRoleForRoute } from "@/lib/auth/routes";
import { getSupabaseConfig, hasSupabaseEnv } from "@/lib/supabase/env";
import type { UserRole } from "@/types/domain";

function redirectWithCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  error: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.searchParams.set("error", error);

  const redirectResponse = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });
  const pathname = request.nextUrl.pathname;

  if (!hasSupabaseEnv()) {
    if (isPrivateRoute(pathname)) {
      return redirectWithCookies(
        request,
        response,
        "/login",
        "Debes iniciar sesion para continuar.",
      );
    }

    return response;
  }

  const { url, key } = getSupabaseConfig();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPrivateRoute(pathname) && !user) {
    return redirectWithCookies(
      request,
      response,
      "/login",
      "Debes iniciar sesion para continuar.",
    );
  }

  const requiredRole = requiredRoleForRoute(pathname);

  if (isPrivateRoute(pathname) && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();
    const role = profile?.role as UserRole | undefined;

    if (!profile?.is_active) {
      return redirectWithCookies(
        request,
        response,
        "/login",
        "Tu cuenta esta desactivada. Contacta al gimnasio.",
      );
    }

    if (requiredRole && role !== requiredRole) {
      return redirectWithCookies(
        request,
        response,
        "/dashboard",
        "No tienes permiso para acceder a esa seccion.",
      );
    }
  }

  return response;
}
