import { ProductMaterial } from './productMaterial';

export enum ProductAreaUnit {
    SquareMeter = 0,
    SquareCentimeter = 1,
}

export enum ProductUnitEnum {
    Set = 0,
    Piece = 1,
    Roll = 2,
}

export enum ProductSize {
    None = 0,
    Other = 1,
    XS = 2,
    S = 3,
    M = 4,
    L = 5,
    XL = 6,
    XXL = 7,
}

export interface Product {
    id: number;
    name: string;
    code: string;
    note: string;
    description: string;
    productCategoryId: number;
    productCategory: null;
    productMaterials: ProductMaterial[];
    createdDate: string;
    createdBy: string;
    productSize: number;
    lastModifiedDate: string;
    lastModifiedBy: string;
    isDeleted: boolean;
    unit: number;
}
