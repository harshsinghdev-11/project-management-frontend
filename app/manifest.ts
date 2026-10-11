import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Project Camp — Project Management",
    short_name: "Project Camp",
    description: "Tactile Papercraft Project Management Workspace",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F5",
    theme_color: "#C86446",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
