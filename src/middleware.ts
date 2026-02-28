import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/skills(.*)',
  '/api/webhooks(.*)',
  '/api/v1(.*)', // Step 1: Make v1 API public for machine discovery
  '/onboarding',
  '/docs/(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { userId } = await auth();
    if (!userId) {
      return Response.redirect(new URL('/', request.url));
    }

    // Check is_admin in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=is_admin`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
          next: { revalidate: 0 }
        });
        
        const data = await res.json();
        if (!data || data.length === 0 || !data[0].is_admin) {
          return Response.redirect(new URL('/', request.url));
        }
      } catch (err) {
        console.error("Failed to verify admin status", err);
        return Response.redirect(new URL('/', request.url));
      }
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
