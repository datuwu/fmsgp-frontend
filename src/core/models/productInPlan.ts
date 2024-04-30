import { Product } from './product';

export interface ProductInPlan {
    id: number;
    quantity: number;
    productionPlanId: number;
    productId: number;
    product: Product;
}
