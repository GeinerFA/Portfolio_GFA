import { ImageResponse } from "next/og";
import { getSiteData } from "@/lib/data/queries";

export const alt = "Portafolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function OpenGraphImage() {
  const { profile } = await getSiteData();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#f2f0eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#8a8a85" }}>
          <div style={{ width: 18, height: 18, borderRadius: 999, background: "#c6ff3d" }} />
          {profile.isAvailable ? "Disponible para proyectos" : "Portafolio"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95 }}>{profile.fullName}</div>
          <div style={{ marginTop: 28, fontSize: 40, color: "#c6ff3d" }}>{profile.role}</div>
        </div>
      </div>
    ),
    size,
  );
}
