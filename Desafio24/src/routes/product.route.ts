import { Router } from "../deps.ts";
import * as ProductHandler from "../handlers/product.handler.ts";

const router = new Router({
    prefix: '/products'
});

router.get('/', ProductHandler.getProducts);
router.get('/:id', ProductHandler.getProduct);
router.post('/', ProductHandler.createProduct);
router.patch('/:id', ProductHandler.updateProduct);
router.delete('/:id', ProductHandler.deleteProduct);

export default router;