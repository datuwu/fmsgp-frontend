export interface MaterialInspectResult {
    id: number;
    materialName: string;
    materialCode: string;
    quantity: number;
    inspectionPassQuantity: number;
    inspectionFailQuantity: number;
    note: string;
    purchaseMaterialId: number;
    inspectionFormId: number;
    receiveQuantity: number;
    requestQuantity: number;
    inspectStatus: number;
    purchaseMaterial: {
        code: string;
        package: number;
        unit: number;
    };
}

export interface InspectionForm {
    id: number;
    resultCode: string;
    poCode: string;
    inspectLocation: string;
    inspectorName: string;
    resultNote: string;
    managerName: string;
    inspectionRequestId: number;
    materialInspectResults: MaterialInspectResult[];
}
