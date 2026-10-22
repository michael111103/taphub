import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#04060A",
          backgroundImage: "radial-gradient(circle at 50% 30%, #0D1B3A, #04060A 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <span style={{ color: "white", fontSize: 120, fontWeight: 800, lineHeight: 1 }}>T</span>
          <span
            style={{
              width: 28,
              height: 28,
              marginLeft: 6,
              marginBottom: 16,
              borderRadius: 7,
              background: "linear-gradient(180deg, #38C8F8, #1B5BFF)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
