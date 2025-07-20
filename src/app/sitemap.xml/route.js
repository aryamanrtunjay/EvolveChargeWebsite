// app/sitemap.xml/route.js
/**
 * Dynamic XML sitemap for Ampereon Energy (JS version for App Router)
 * Place this folder under /app so the route becomes /sitemap.xml
 */

const BASE_URL = 'https://www.ampereonenergy.com';

export async function GET() {
  // 1 – list your public routes
    const staticRoutes = [
        { path: '/',              changefreq: 'daily',   priority: '1.0' },
        { path: '/product',       changefreq: 'weekly',  priority: '0.9' },
        { path: '/order',         changefreq: 'weekly',  priority: '0.9' },
        { path: '/about',         changefreq: 'monthly', priority: '0.8' },
        { path: '/faq',           changefreq: 'monthly', priority: '0.8' },
        { path: '/support-us',    changefreq: 'monthly', priority: '0.8' },
        { path: '/donate',        changefreq: 'monthly', priority: '0.7' },
        { path: '/privacy-policy',   changefreq: 'yearly', priority: '0.4' },
        { path: '/terms-of-service', changefreq: 'yearly', priority: '0.4' },
    ];  


  // 2 – (optional) add dynamic routes here
  // e.g. blog posts, products, etc.

  // 3 – build the XML
  const urls = staticRoutes
    .map(
      ({ path, changefreq, priority }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`.trim();

  // 4 – return the XML response
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
