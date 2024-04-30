import { EnumListItem } from '../models/common';
import {
    AreaUnit,
    PackageUnitEnum,
    RawMaterial,
    RawMaterialColor,
    RawMaterialDiameterUnit,
    RawMaterialLengthUnit,
    RawMaterialPackage, // RawMaterialLengthUnit,
    RawMaterialShape,
    RawMaterialSize,
    RawMaterialSizeUnit,
    RawMaterialUnit,
    RawMaterialWeightUnit,
    ThreadRatioEnum, // RawMaterialWeightUnit,
} from '../models/rawMaterial';
import { getColorWithId } from '../utils/api.helper';
import http from './http';

export interface ICreateRawMaterialDto
    extends Pick<
        RawMaterial,
        | 'name'
        | 'color'
        | 'shape'
        | 'unit'
        | 'imageUrl'
        | 'description'
        | 'estimatePrice'
        | 'materialCategoryId'
        | 'package'
        | 'minToleranceWeight'
        | 'maxToleranceWeight'
        | 'weightUnit'
        | 'length'
        | 'width'
        | 'height'
        | 'sizeUnitEnum'
        | 'diameter'
        | 'diameterUnit'
        | 'mainIngredient'
        | 'threadRatio'
        | 'weight'
    > {}
export interface IUpdateRawMaterialDto
    extends Pick<
        RawMaterial,
        | 'id'
        | 'name'
        | 'color'
        | 'shape'
        | 'unit'
        | 'imageUrl'
        | 'description'
        | 'estimatePrice'
        | 'materialCategoryId'
        | 'package'
        | 'minToleranceWeight'
        | 'maxToleranceWeight'
        | 'weightUnit'
        | 'length'
        | 'width'
        | 'height'
        | 'sizeUnitEnum'
        | 'diameter'
        | 'diameterUnit'
        | 'mainIngredient'
        | 'threadRatio'
        | 'weight'
    > {}

const baseUrl = '/RawMaterial';

export const rawMaterialApi = {
    getAll: async () => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);

        return data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<RawMaterial>(`${baseUrl}/${id}`);

        return data;
    },
    create: async (role: ICreateRawMaterialDto) => {
        const { data } = await http.post<RawMaterial>(baseUrl, role);

        return data;
    },
    update: async (role: IUpdateRawMaterialDto) => {
        const { data } = await http.put<RawMaterial>(baseUrl, role);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },

    getEnumSelectOptionWithoutUnit: async () => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);

        const result: EnumListItem[] = data.map((item) => {
            return {
                id: item.id,
                label: item.name,
                color: '',
                name: item.name,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },

    getEnumSelectOptionWithPackage: async () => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);
        const packages = await rawMaterialApi.getEnumPackageUnit();
        const units = await rawMaterialApi.getEnumUnit();

        const result: EnumListItem[] = data.map((item) => {
            const packageItem = packages.find((u) => u.id === item.package);
            const unit = units.find((u) => u.id === item.unit);
            return {
                id: item.id,
                label: `${item.name} (${packageItem?.name}, with ${unit?.name} inside)`,
                color: '',
                name: `${item.name}  (${packageItem?.name}, with ${unit?.name} inside)`,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },
    getEnumSelectOptionWithPackageWithCode: async () => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);
        const packages = await rawMaterialApi.getEnumPackageUnit();
        const units = await rawMaterialApi.getEnumUnit();

        const result: EnumListItem[] = data.map((item) => {
            const packageItem = packages.find((u) => u.id === item.package);
            const unit = units.find((u) => u.id === item.unit);
            return {
                id: item.id,
                label: `${item.code} - ${item.name} (${packageItem?.name}, with ${unit?.name} inside)`,
                color: '',
                name: `${item.code} - ${item.name}  (${packageItem?.name}, with ${unit?.name} inside)`,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },

    getEnumCodeSelectOption: async () => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);

        const result: EnumListItem[] = data.map((item) => {
            return {
                id: item.id,
                label: item.code,
                color: '',
                name: item.code,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },

    getEnumSelectOption: async () => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);
        const units = await rawMaterialApi.getEnumUnit();

        const result: EnumListItem[] = data.map((item) => {
            const unit = units.find((u) => u.id === item.unit);
            return {
                id: item.id,
                label: `${item.name} (${unit?.name})`,
                color: '',
                name: `${item.name} (${unit?.name})`,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },

    getEnumSelectOptionWithCode: async () => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);
        const units = await rawMaterialApi.getEnumUnit();
        const packages = await rawMaterialApi.getEnumPackageUnit();

        const result: EnumListItem[] = data.map((item) => {
            const unit = units.find((u) => u.id === item.unit);
            const packageItem = packages.find((u) => u.id === item.package);
            return {
                id: item.id,
                label: `${item.code} - ${item.name} (${packageItem?.name})`,
                color: '',
                name: `${item.code} - ${item.name} (${packageItem?.name})`,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },

    getEnumSelectOptionPackageWithoutUnit: async () => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);
        const packages = await rawMaterialApi.getEnumPackageUnit();

        console.log(packages);

        const result: EnumListItem[] = data.map((item) => {
            const packageItem = packages.find((u) => u.id === item.package);
            return {
                id: item.id,
                label: `${item.name} (${packageItem?.name})`,
                color: '',
                name: `${item.name}  (${packageItem?.name})`,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },

    getEnumUnitWithMaterialId: async (id: number) => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);
        const units = await rawMaterialApi.getEnumUnit();

        const result: EnumListItem[] = data.map((item) => {
            const unit = units.find((u) => u.id === item.unit);
            return {
                id: item.id,
                label: `${unit?.name}`,
                color: '',
                name: `${unit?.name}`,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },

    getEnumPackageWithMaterialId: async (id: number) => {
        const { data } = await http.get<RawMaterial[]>(baseUrl);
        const packages = await rawMaterialApi.getEnumPackageUnit();

        const result: EnumListItem[] = data.map((item) => {
            const packageItem = packages.find((u) => u.id === item.package);
            return {
                id: item.id,
                label: `${packageItem?.name}`,
                color: '',
                name: `${packageItem?.name}`,
                slug: item.id.toString(),
                value: item.id,
            };
        });

        return result;
    },

    getEnumUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: RawMaterialUnit.Piece,
                name: 'Piece',
                label: 'Piece',
                slug: 'piece',
                value: RawMaterialUnit.Piece,
                color: getColorWithId(RawMaterialUnit.Piece),
            },
            {
                id: RawMaterialUnit.Kilogram,
                name: 'Kilogram',
                label: 'Kilogram',
                slug: 'kilogram',
                value: RawMaterialUnit.Kilogram,
                color: getColorWithId(RawMaterialUnit.Kilogram),
            },
            {
                id: RawMaterialUnit.Gram,
                name: 'Gram',
                label: 'Gram',
                slug: 'gram',
                value: RawMaterialUnit.Gram,
                color: getColorWithId(RawMaterialUnit.Gram),
            },
            {
                id: RawMaterialUnit.Meter,
                name: 'Meter',
                label: 'Meter',
                slug: 'meter',
                value: RawMaterialUnit.Meter,
                color: getColorWithId(RawMaterialUnit.Meter),
            },

            {
                id: RawMaterialUnit.Liter,
                name: 'Liter',
                label: 'Liter',
                slug: 'liter',
                value: RawMaterialUnit.Liter,
                color: getColorWithId(RawMaterialUnit.Liter),
            },
            {
                id: RawMaterialUnit.Squaremeter,
                name: 'Squaremeter',
                label: 'Squaremeter',
                slug: 'squaremeter',
                value: RawMaterialUnit.Squaremeter,
                color: getColorWithId(RawMaterialUnit.Squaremeter),
            },
        ];
        return list;
    },
    getWeightUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: RawMaterialWeightUnit.Kilogram,
                name: 'Kilogram',
                label: 'Kilogram',
                slug: 'kilogram',
                value: RawMaterialWeightUnit.Kilogram,
                color: getColorWithId(RawMaterialWeightUnit.Kilogram),
            },
            {
                id: RawMaterialWeightUnit.Gram,
                name: 'Gram',
                label: 'Gram',
                slug: 'gram',
                value: RawMaterialWeightUnit.Gram,
                color: getColorWithId(RawMaterialWeightUnit.Gram),
            },
            {
                id: RawMaterialWeightUnit.Tonne,
                name: 'Tonne',
                label: 'Tonne',
                slug: 'tonne',
                value: RawMaterialWeightUnit.Tonne,
                color: getColorWithId(RawMaterialWeightUnit.Tonne),
            },
        ];
        return list;
    },
    getPackageUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: RawMaterialPackage.Piece,
                name: 'Piece',
                label: 'Piece',
                slug: 'piece',
                value: RawMaterialPackage.Piece,
                color: getColorWithId(RawMaterialPackage.Piece),
            },
            {
                id: RawMaterialPackage.Box,
                name: 'Box',
                label: 'Box',
                slug: 'box',
                value: RawMaterialPackage.Box,
                color: getColorWithId(RawMaterialPackage.Box),
            },
            {
                id: RawMaterialPackage.Bin,
                name: 'Bin',
                label: 'Bin',
                slug: 'bin',
                value: RawMaterialPackage.Bin,
                color: getColorWithId(RawMaterialPackage.Bin),
            },
            {
                id: RawMaterialPackage.Roll,
                name: 'Roll',
                label: 'Roll',
                slug: 'roll',
                value: RawMaterialPackage.Roll,
                color: getColorWithId(RawMaterialPackage.Roll),
            },
            {
                id: RawMaterialPackage.Barrel,
                name: 'Barrel',
                label: 'Barrel',
                slug: 'barrel',
                value: RawMaterialPackage.Barrel,
                color: getColorWithId(RawMaterialPackage.Barrel),
            },
        ];
        return list;
    },

    getLengthUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: RawMaterialLengthUnit.Meter,
                name: 'Meter',
                label: 'Meter',
                slug: 'meter',
                value: RawMaterialLengthUnit.Meter,
                color: getColorWithId(RawMaterialLengthUnit.Meter),
            },
            {
                id: RawMaterialLengthUnit.Centimeter,
                name: 'Centimeter',
                label: 'Centimeter',
                slug: 'centimeter',
                value: RawMaterialLengthUnit.Centimeter,
                color: getColorWithId(RawMaterialLengthUnit.Centimeter),
            },
            {
                id: RawMaterialLengthUnit.Millimeter,
                name: 'Millimeter',
                label: 'Millimeter',
                slug: 'millimeter',
                value: RawMaterialLengthUnit.Millimeter,
                color: getColorWithId(RawMaterialLengthUnit.Millimeter),
            },
        ];
        return list;
    },
    getThreadRatio: async () => {
        const list: EnumListItem[] = [
            {
                id: ThreadRatioEnum.None,
                name: 'None',
                label: 'None',
                slug: 'none',
                value: ThreadRatioEnum.None,
                color: getColorWithId(ThreadRatioEnum.None),
            },
            {
                id: ThreadRatioEnum.Other,
                name: 'Other',
                label: 'Other',
                slug: 'other',
                value: ThreadRatioEnum.Other,
                color: getColorWithId(ThreadRatioEnum.Other),
            },
            {
                id: ThreadRatioEnum._60_3,
                name: '60/3',
                label: '60/3',
                slug: '60/3',
                value: ThreadRatioEnum._60_3,
                color: getColorWithId(ThreadRatioEnum._60_3),
            },
            {
                id: ThreadRatioEnum._40_2,
                name: '40/2',
                label: '40/2',
                slug: '40/2',
                value: ThreadRatioEnum._40_2,
                color: getColorWithId(ThreadRatioEnum._40_2),
            },
            {
                id: ThreadRatioEnum._20_6,
                name: '20/6',
                label: '20/6',
                slug: '20/6',
                value: ThreadRatioEnum._20_6,
                color: getColorWithId(ThreadRatioEnum._20_6),
            },
            {
                id: ThreadRatioEnum._40_3,
                name: '40/3',
                label: '40/3',
                slug: '40/3',
                value: ThreadRatioEnum._40_3,
                color: getColorWithId(ThreadRatioEnum._40_3),
            },
        ];
        return list;
    },

    getDiameterUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: RawMaterialDiameterUnit.Meter,
                name: 'Meter',
                label: 'Meter',
                slug: 'meter',
                value: RawMaterialDiameterUnit.Meter,
                color: getColorWithId(RawMaterialDiameterUnit.Meter),
            },
            {
                id: RawMaterialDiameterUnit.Centimeter,
                name: 'Centimeter',
                label: 'Centimeter',
                slug: 'centimeter',
                value: RawMaterialDiameterUnit.Centimeter,
                color: getColorWithId(RawMaterialDiameterUnit.Centimeter),
            },
            {
                id: RawMaterialDiameterUnit.Millimeter,
                name: 'Millimeter',
                label: 'Millimeter',
                slug: 'millimeter',
                value: RawMaterialDiameterUnit.Millimeter,
                color: getColorWithId(RawMaterialDiameterUnit.Millimeter),
            },
        ];
        return list;
    },
    getAreaUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: AreaUnit.SquareCentimeter,
                name: 'Square Centimeter',
                label: 'Square Centimeter',
                slug: 'squareCentimeter',
                value: AreaUnit.SquareCentimeter,
                color: getColorWithId(AreaUnit.SquareCentimeter),
            },
            {
                id: AreaUnit.SquareMeter,
                name: 'Square Meter',
                label: 'Square Meter',
                slug: 'squareMeter',
                value: AreaUnit.SquareMeter,
                color: getColorWithId(AreaUnit.SquareMeter),
            },
        ];
        return list;
    },

    getEnumShape: async () => {
        const list: EnumListItem[] = [
            {
                id: RawMaterialShape.None,
                name: 'None',
                label: 'None',
                slug: 'None',
                value: RawMaterialShape.None,
                color: getColorWithId(RawMaterialShape.None),
            },
            {
                id: RawMaterialShape.Circle,
                name: 'Circle',
                label: 'Circle',
                slug: 'circle',
                value: RawMaterialShape.Circle,
                color: getColorWithId(RawMaterialShape.Circle),
            },
            {
                id: RawMaterialShape.Square,
                name: 'Square',
                label: 'Square',
                slug: 'square',
                value: RawMaterialShape.Square,
                color: getColorWithId(RawMaterialShape.Square),
            },
            {
                id: RawMaterialShape.Box,
                name: 'Box',
                label: 'Box',
                slug: 'box',
                value: RawMaterialShape.Box,
                color: getColorWithId(RawMaterialShape.Box),
            },
            {
                id: RawMaterialShape.Cube,
                name: 'Cube',
                label: 'Cube',
                slug: 'cube',
                value: RawMaterialShape.Cube,
                color: getColorWithId(RawMaterialShape.Cube),
            },
            {
                id: RawMaterialShape.Cylinder,
                name: 'Cylinder',
                label: 'Cylinder',
                slug: 'cylinder',
                value: RawMaterialShape.Cylinder,
                color: getColorWithId(RawMaterialShape.Cylinder),
            },
        ];
        return list;
    },
    getEnumSize: async () => {
        const list: EnumListItem[] = [
            {
                id: RawMaterialSize.Small,
                name: 'Small',
                label: 'Small',
                slug: 'small',
                value: RawMaterialSize.Small,
                color: getColorWithId(RawMaterialSize.Small),
            },
            {
                id: RawMaterialSize.Medium,
                name: 'Medium',
                label: 'Medium',
                slug: 'medium',
                value: RawMaterialSize.Medium,
                color: getColorWithId(RawMaterialSize.Medium),
            },
            {
                id: RawMaterialSize.Large,
                name: 'Large',
                label: 'Large',
                slug: 'large',
                value: RawMaterialSize.Large,
                color: getColorWithId(RawMaterialSize.Large),
            },
            {
                id: RawMaterialSize.ExtraLarge,
                name: 'ExtraLarge',
                label: 'ExtraLarge',
                slug: 'extraLarge',
                value: RawMaterialSize.ExtraLarge,
                color: getColorWithId(RawMaterialSize.ExtraLarge),
            },
        ];
        return list;
    },
    getEnumColor: async () => {
        const list: EnumListItem[] = [
            {
                id: 0,
                name: 'Red',
                label: 'Red',
                slug: 'red',
                value: 0,
                color: getColorWithId(RawMaterialColor.Red),
            },
            {
                id: 1,
                name: 'Green',
                label: 'Green',
                slug: 'green',
                value: 1,
                color: getColorWithId(RawMaterialColor.Green),
            },
            {
                id: 2,
                name: 'Blue',
                label: 'Blue',
                slug: 'blue',
                value: 2,
                color: getColorWithId(RawMaterialColor.Blue),
            },
            {
                id: 3,
                name: 'Yellow',
                label: 'Yellow',
                slug: 'yellow',
                value: 3,
                color: getColorWithId(RawMaterialColor.Yellow),
            },
            {
                id: 4,
                name: 'Black',
                label: 'Black',
                slug: 'black',
                value: 4,
                color: getColorWithId(RawMaterialColor.Black),
            },
            {
                id: 5,
                name: 'White',
                label: 'White',
                slug: 'white',
                value: 5,
                color: getColorWithId(RawMaterialColor.White),
            },
            {
                id: 6,
                name: 'Orange',
                label: 'Orange',
                slug: 'orange',
                value: 6,
                color: getColorWithId(RawMaterialColor.Orange),
            },
            {
                id: 7,
                name: 'Purple',
                label: 'Purple',
                slug: 'purple',
                value: 7,
                color: getColorWithId(RawMaterialColor.Purple),
            },
            {
                id: 8,
                name: 'Pink',
                label: 'Pink',
                slug: 'pink',
                value: 8,
                color: getColorWithId(RawMaterialColor.Pink),
            },
            {
                id: 9,
                name: 'Brown',
                label: 'Brown',
                slug: 'brown',
                value: 9,
                color: getColorWithId(RawMaterialColor.Brown),
            },
            {
                id: 10,
                name: 'Gray',
                label: 'Gray',
                slug: 'gray',
                value: 10,
                color: getColorWithId(RawMaterialColor.Gray),
            },
            {
                id: 11,
                name: 'Cyan',
                label: 'Cyan',
                slug: 'cyan',
                value: 11,
                color: getColorWithId(RawMaterialColor.Cyan),
            },
            {
                id: 12,
                name: 'Magenta',
                label: 'Magenta',
                slug: 'magenta',
                value: 12,
                color: getColorWithId(RawMaterialColor.Magenta),
            },
            {
                id: 13,
                name: 'Gold',
                label: 'Gold',
                slug: 'gold',
                value: 13,
                color: getColorWithId(RawMaterialColor.Gold),
            },
            {
                id: 14,
                name: 'Silver',
                label: 'Silver',
                slug: 'silver',
                value: 14,
                color: getColorWithId(RawMaterialColor.Silver),
            },
            {
                id: 15,
                name: 'Bronze',
                label: 'Bronze',
                slug: 'bronze',
                value: 15,
                color: getColorWithId(RawMaterialColor.Bronze),
            },
            {
                id: 16,
                name: 'Copper',
                label: 'Copper',
                slug: 'copper',
                value: 16,
                color: getColorWithId(RawMaterialColor.Copper),
            },
        ];
        return list;
    },

    getEnumPackageUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: PackageUnitEnum.Bag,
                name: 'Bag',
                label: 'Bag',
                slug: 'bag',
                value: PackageUnitEnum.Bag,
                color: getColorWithId(PackageUnitEnum.Bag),
            },
            {
                id: PackageUnitEnum.Roll,
                name: 'Roll',
                label: 'Roll',
                slug: 'roll',
                value: PackageUnitEnum.Roll,
                color: getColorWithId(PackageUnitEnum.Roll),
            },
            {
                id: PackageUnitEnum.Can,
                name: 'Can',
                label: 'Can',
                slug: 'can',
                value: PackageUnitEnum.Can,
                color: getColorWithId(PackageUnitEnum.Can),
            },
            {
                id: PackageUnitEnum.Carton,
                name: 'Carton',
                label: 'Carton',
                slug: 'carton',
                value: PackageUnitEnum.Carton,
                color: getColorWithId(PackageUnitEnum.Carton),
            },
        ];
        return list;
    },

    getSizeUnit: async () => {
        const list: EnumListItem[] = [
            {
                id: RawMaterialSizeUnit.Meter,
                name: 'Meter',
                label: 'Meter',
                slug: 'meter',
                value: RawMaterialSizeUnit.Meter,
                color: getColorWithId(RawMaterialSizeUnit.Meter),
            },
            {
                id: RawMaterialSizeUnit.Centimeter,
                name: 'Centimeter',
                label: 'Centimeter',
                slug: 'centimeter',
                value: RawMaterialSizeUnit.Centimeter,
                color: getColorWithId(RawMaterialSizeUnit.Centimeter),
            },
            {
                id: RawMaterialSizeUnit.Millimeter,
                name: 'Millimeter',
                label: 'Millimeter',
                slug: 'millimeter',
                value: RawMaterialSizeUnit.Millimeter,
                color: getColorWithId(RawMaterialSizeUnit.Millimeter),
            },
        ];
        return list;
    },
};
