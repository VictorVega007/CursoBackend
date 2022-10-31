import { Application } from "./deps.ts";
import ProductRouter from "./routes/product.route.ts";
import { logger } from "./middlewares/logger.middleware.ts";

import "./configs/db.config.ts";

const PORT = 4343;
const app = new Application();

app.use(logger);
app.use(ProductRouter.routes());

console.log(`Server running on port http://localhost:${PORT}`);
await app.listen({ port: PORT });