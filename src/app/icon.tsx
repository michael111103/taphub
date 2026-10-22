import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon: huruf "T" putih dengan titik biru, mengikuti logo TapHUB.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#04060A",
          borderRadius: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <span style={{ color: "white", fontSize: 46, fontWeight: 800, lineHeight: 1 }}>T</span>
          <span
            style={{
              width: 11,
              height: 11,
              marginLeft: 2,
              marginBottom: 6,
              borderRadius: 3,
              background: "linear-gradient(180deg, #38C8F8, #1B5BFF)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
