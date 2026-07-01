import { HttpResponse, http } from "msw";

export const handlers = [
  // Mock Auth API
  http.post("*/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as any;
    if (body.identifier === "PG001" && body.katasandi === "password123") {
      return HttpResponse.json({
        success: true,
        token: "fake-token-pgbo",
        user: {
          id: "usr_123",
          role: "pgbo",
          pgcode: "PG001",
          nama_lengkap: "Test PGBO",
          is_active: 1,
        },
      });
    }
    if (body.identifier === "INACTIVE" && body.katasandi === "password123") {
      return HttpResponse.json({
        success: true,
        token: "fake-token-inactive",
        user: {
          id: "usr_inactive",
          role: "pgbo",
          pgcode: "INACTIVE",
          nama_lengkap: "Inactive PGBO",
          is_active: 0,
        },
      });
    }
    return HttpResponse.json(
      { success: false, message: "Kredensial tidak valid" },
      { status: 401 },
    );
  }),

  http.get("*/api/auth/me", () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: "usr_123",
        role: "pgbo",
        pgcode: "PG001",
        nama_lengkap: "Test PGBO",
        is_active: 1,
      },
    });
  }),

  http.get("*/api/overview", () => {
    return HttpResponse.json({
      success: true,
      data: {
        total_pengunjung: 100,
        total_pendaftar: 50,
        total_klik_whatsapp: 25,
        tabel_pendaftar_terbaru: [
          {
            id: "lead_1",
            nama_lengkap: "Budi Santoso",
            email: "budi@example.com",
            no_telpon: "08123456789",
            created_at: new Date().toISOString(),
          },
        ],
      },
    });
  }),

  http.get("*/api/settings", () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: "usr_123",
        role: "pgbo",
        pgcode: "PG001",
        nama_lengkap: "Test PGBO",
        pageid: "testpage",
        portal_lockout_expiry: null,
        portal_is_unlocked: true,
      },
    });
  }),
];
