import { HttpResponse, http } from "msw";

export const handlers = [
  // Mock Public API for landing page
  http.get("*/api/public/gold-prices", () => {
    return HttpResponse.json({
      success: true,
      data: {
        poe: [
          { label: "1 g", price: "1500000" },
          { label: "Harga Per Gram", price: "1500000" },
        ],
        dinar: [],
        goldbar: [],
      },
    });
  }),

  http.get("*/api/public/pgbo/:pageid", ({ params }) => {
    const { pageid } = params;
    if (pageid === "valid-pageid") {
      return HttpResponse.json({
        success: true,
        data: {
          pgcode: "PG001",
          pageid: "valid-pageid",
          nama_lengkap: "Agent Valid",
          nama_panggilan: "Agent",
          email: "agent@example.com",
          no_telpon: "08123456789",
          foto_profil_url: "https://example.com/avatar.png",
          link_group_whatsapp: "https://chat.whatsapp.com/123",
        },
      });
    }
    return HttpResponse.json(
      { success: false, message: "Page ID tidak ditemukan" },
      { status: 404 },
    );
  }),

  http.get("*/api/public/agents", () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          pageid: "valid-pageid",
          nama_panggilan: "Agent",
          foto_profil_url: "https://example.com/avatar.png",
        },
      ],
    });
  }),

  http.post("*/api/public/register-track", async ({ request }) => {
    const body = (await request.json()) as any;
    if (body.pageid === "valid-pageid") {
      return HttpResponse.json({
        success: true,
        message: "Lead tracked successfully",
      });
    }
    return HttpResponse.json(
      { success: false, message: "Agent tidak ditemukan" },
      { status: 404 },
    );
  }),

  http.post("*/api/public/analytics", async () => {
    return HttpResponse.json({ success: true });
  }),
];
