export interface RawMaterial {
    id: number;
    name: string;
    code: string;
    color: any;
    size: any;
    shape: any;
    unit: any;
    package: any;
    imageUrl: string;
    description: string;
    storageGuide: string;
    estimatePrice: number;
    materialCategoryId: number;
    storageDuration: number;
    minToleranceWeight: number;
    maxToleranceWeight: number;
    weightUnit: number;
    length: number;
    width: number;
    height: number;
    sizeUnitEnum: number;
    diameter: number;
    diameterUnit: number;
    mainIngredient: string;
    threadRatio: number;
    weight: number;
}

export enum ThreadRatioEnum {
    None = 0,
    Other = 1,
    _60_3 = 2,
    _40_2 = 3,
    _20_6 = 4,
    _40_3 = 5,
}

export enum PackageUnitEnum {
    Bag = 0,
    Roll = 1,
    Can = 2,
    Carton = 3,
}

export enum RawMaterialPackage {
    Piece = 0,
    Box = 1,
    Bin = 2,
    Roll = 3,
    Barrel = 4,
}

export enum RawMaterialColor {
    Red = 0,
    Green = 1,
    Blue = 2,
    Yellow = 3,
    Black = 4,
    White = 5,
    Orange = 6,
    Purple = 7,
    Pink = 8,
    Brown = 9,
    Gray = 10,
    Cyan = 11,
    Magenta = 12,
    Gold = 13,
    Silver = 14,
    Bronze = 15,
    Copper = 16,
    None = 17,
    Other = 18,
}

export enum RawMaterialSize {
    Small = 0,
    Medium = 1,
    Large = 2,
    ExtraLarge = 3,
}

export enum RawMaterialShape {
    None = 0,
    Circle = 1,
    Square = 2,
    Box = 3,
    Cube = 4,
    Cylinder = 5,
    Straight = 6,
    Curved = 7,
}

export enum RawMaterialUnit {
    Piece = 0,
    Kilogram = 1,
    Gram = 2,
    Meter = 3,
    Liter = 4,
    Squaremeter = 5,
}

export enum RawMaterialWeightUnit {
    Tonne = 0,
    Kilogram = 1,
    Gram = 2,
}

export enum RawMaterialLengthUnit {
    Meter = 0,
    Centimeter = 1,
    Millimeter = 2,
}

export enum RawMaterialDiameterUnit {
    Meter = 0,
    Centimeter = 1,
    Millimeter = 2,
}

export enum RawMaterialSizeUnit {
    Meter = 0,
    Centimeter = 1,
    Millimeter = 2,
}

export enum AreaUnit {
    SquareMeter = 0,
    SquareCentimeter = 1,
}

export const getColor = (color: RawMaterialColor) => {
    switch (color) {
        case RawMaterialColor.Red:
            return '#e74c3c';
        case RawMaterialColor.Green:
            return '#2ecc71';
        case RawMaterialColor.Blue:
            return '#3498db';
        case RawMaterialColor.Yellow:
            return '#f1c40f';
        case RawMaterialColor.Black:
            return '#34495e';
        case RawMaterialColor.White:
            return '#ecf0f1';
        case RawMaterialColor.Orange:
            return '#e67e22';
        case RawMaterialColor.Purple:
            return '#9b59b6';
        case RawMaterialColor.Pink:
            return '#e91e63';
        case RawMaterialColor.Brown:
            return '#795548';
        case RawMaterialColor.Gray:
            return '#607d8b';
        case RawMaterialColor.Cyan:
            return '#00bcd4';
        case RawMaterialColor.Magenta:
            return '#e91e63';
        case RawMaterialColor.Gold:
            return '#d4af37';
        case RawMaterialColor.Silver:
            return '#bdc3c7';
        case RawMaterialColor.Bronze:
            return '#cd7f32';
        case RawMaterialColor.Copper:
            return '#b87333';
        case RawMaterialColor.None:
            return '#bdc3c7';
        case RawMaterialColor.Other:
            return '#bdc3c7';
    }
};
