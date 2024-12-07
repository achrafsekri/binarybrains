import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "sotacib",
    short_name: "sotacib",
    description: "sotacib cimenterie",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/fav.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/fav.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
