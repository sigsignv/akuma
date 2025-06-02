import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/welcome.tsx"),
  route("reactions", "./routes/reactions.tsx"),
  route("share", "./routes/share.tsx"),
] satisfies RouteConfig;
