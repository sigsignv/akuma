import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("./routes/welcome.tsx"),
  layout("./pages/layout.tsx", [route("peek", "./routes/peek.tsx")]),
] satisfies RouteConfig;
