import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/welcome.tsx"),
  route("peek", "./routes/peek.tsx"),
] satisfies RouteConfig;
