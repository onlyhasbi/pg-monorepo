import { SITE_URL } from "@repo/lib/config";
import { getAgentsFn } from "@repo/services/api.functions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const agentsRes = await getAgentsFn();
          const agents = agentsRes.data || [];

          let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
          xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

          // Main Pages
          const routes = [
            { path: "/register", priority: "0.9", changefreq: "daily" },
            { path: "/petunjuk", priority: "0.9", changefreq: "daily" },
          ];
          routes.forEach(({ path, priority, changefreq }) => {
            xml += `  <url>\n`;
            xml += `    <loc>${SITE_URL}${path}</loc>\n`;
            xml += `    <changefreq>${changefreq}</changefreq>\n`;
            xml += `    <priority>${priority}</priority>\n`;
            xml += `  </url>\n`;
          });

          // Agent Pages
          agents.forEach((agent: { pageid: string }) => {
            xml += `  <url>\n`;
            xml += `    <loc>${SITE_URL}/${agent.pageid}</loc>\n`;
            xml += `    <changefreq>daily</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
          });

          xml += `</urlset>`;

          return new Response(xml, {
            headers: {
              "Content-Type": "application/xml",
            },
          });
        } catch (error) {
          console.error("Error generating sitemap:", error);
          return new Response("Error generating sitemap", { status: 500 });
        }
      },
    },
  },
});
