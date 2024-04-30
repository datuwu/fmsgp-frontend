import * as React from 'react';

import { BsBoxSeam } from 'react-icons/bs';
import { FiList } from 'react-icons/fi';
import { HiUserGroup } from 'react-icons/hi';
import { IoIosGitPullRequest } from 'react-icons/io';
import { LuBoxes } from 'react-icons/lu';
import { RiFileList3Line } from 'react-icons/ri';
import { TbBuildingWarehouse } from 'react-icons/tb';
import { useSelector } from 'react-redux';

import { NKRouter } from '../NKRouter';
import { useNKRouter } from '../routing/hooks/NKRouter';
import { RootState } from '../store';
import { UserState } from '../store/user';

export interface IMenuItem {
    key: string;
    icon?: React.ReactNode;
    label: string;
    onClick?: () => void;
    children?: IMenuItem[];
}

export interface IMenuDashboardContext {
    menu: IMenuItem[];
}

export const MenuDashboardContext = React.createContext<IMenuDashboardContext>({
    menu: [],
});

interface MenuDashboardProviderProps {
    children: React.ReactNode;
}

export const MenuDashboardProvider: React.FC<MenuDashboardProviderProps> = ({ children }) => {
    const router = useNKRouter();
    const { isManager, isPurchasingStaff, isPurchasingManager, isSupplier, isWarehouseStaff, isInspector } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    return (
        <MenuDashboardContext.Provider
            value={{
                menu: [
                    ...(isManager
                        ? [
                              {
                                  icon: <HiUserGroup />,
                                  key: 'user',
                                  label: 'User Management',
                                  children: [
                                      {
                                          key: 'user',
                                          label: 'User',
                                          onClick: () => {
                                              router.push(NKRouter.user.list());
                                          },
                                      },
                                      {
                                          key: 'role',
                                          label: 'User Role',
                                          onClick: () => {
                                              router.push(NKRouter.role.list());
                                          },
                                      },
                                      {
                                          key: 'supplier-account-request',
                                          label: 'Supplier Account Request',
                                          onClick: () => {
                                              router.push(NKRouter.supplierAccountRequest.list());
                                          },
                                      },
                                      {
                                          key: 'supplier',
                                          label: 'Supplier',
                                          onClick: () => {
                                              router.push(NKRouter.supplier.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  icon: <FiList />,
                                  key: 'production-plan',
                                  label: 'Production Plan',
                                  onClick: () => {
                                      router.push(NKRouter.productionPlan.list());
                                  },
                              },
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasingPlan',
                                  label: 'Purchasing Plan',
                                  onClick: () => {
                                      router.push(NKRouter.purchasingPlan.list());
                                  },
                              },
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasing',
                                  label: 'Purchasing',
                                  children: [
                                      {
                                          key: 'purchasingTask',
                                          label: 'Purchasing Task',
                                          onClick: () => {
                                              router.push(NKRouter.purchasingTask.list());
                                          },
                                      },
                                      {
                                          key: 'purchasingOrder',
                                          label: 'Purchasing Order',
                                          onClick: () => {
                                              router.push(NKRouter.purchasingOrder.list());
                                          },
                                      },
                                      //   {
                                      //       key: 'poReport',
                                      //       label: 'PO Report',
                                      //       onClick: () => {
                                      //           router.push(NKRouter.poReport.list());
                                      //       },
                                      //   },
                                  ],
                              },
                              {
                                  icon: <LuBoxes />,
                                  key: 'Material',
                                  label: 'Material',
                                  children: [
                                      {
                                          key: 'rawMaterial',
                                          label: 'Raw Material',
                                          onClick: () => {
                                              router.push(NKRouter.rawMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'materialCategory',
                                          label: 'Material Category',
                                          onClick: () => {
                                              router.push(NKRouter.materialCategory.list());
                                          },
                                      },
                                      {
                                          key: 'product',
                                          label: 'Product',
                                          onClick: () => {
                                              router.push(NKRouter.product.list());
                                          },
                                      },
                                      {
                                          key: 'productCategory',
                                          label: 'Product Category',
                                          onClick: () => {
                                              router.push(NKRouter.productCategory.list());
                                          },
                                      },
                                  ],
                              },
                              //   {
                              //       icon: <IoIosGitPullRequest />,
                              //       key: 'warehouse-request',
                              //       label: 'Warehouse Request',
                              //       children: [
                              //           {
                              //               key: 'temp-warehouse-request',
                              //               label: 'Temp Warehouse Request',
                              //               onClick: () => {
                              //                   router.push(NKRouter.tempWarehouseRequest.list());
                              //               },
                              //           },
                              //           //   {
                              //           //       key: 'main-warehouse-request',
                              //           //       label: 'Main Warehouse Request',
                              //           //       onClick: () => {
                              //           //           router.push(NKRouter.importMainWarehouseRequest.list());
                              //           //       },
                              //           //   },

                              //           {
                              //               key: 'inspection-request',
                              //               label: 'Inspection Request',
                              //               onClick: () => {
                              //                   router.push(NKRouter.inspectionRequest.list());
                              //               },
                              //           },
                              //       ],
                              //   },
                              {
                                  icon: <IoIosGitPullRequest />,
                                  key: 'temp-warehouse-request',
                                  label: 'Temp Warehouse Request',
                                  onClick: () => {
                                      router.push(NKRouter.tempWarehouseRequest.list());
                                  },
                              },
                              //   {
                              //       key: 'main-warehouse-request',
                              //       label: 'Main Warehouse Request',
                              //       onClick: () => {
                              //           router.push(NKRouter.importMainWarehouseRequest.list());
                              //       },
                              //   },

                              {
                                  icon: <IoIosGitPullRequest />,
                                  key: 'inspection-request',
                                  label: 'Inspection Request',
                                  onClick: () => {
                                      router.push(NKRouter.inspectionRequest.list());
                                  },
                              },
                              {
                                  icon: <TbBuildingWarehouse />,
                                  key: 'warehousing',
                                  label: 'Warehousing',
                                  children: [
                                      {
                                          key: 'warehouse',
                                          label: 'Warehouse',
                                          onClick: () => {
                                              router.push(NKRouter.warehouse.list());
                                          },
                                      },
                                      {
                                          key: 'main-warehouse-material',
                                          label: 'Main Warehouse Material',
                                          onClick: () => {
                                              router.push(NKRouter.warehouseMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'temp-warehouse-material',
                                          label: 'Temp Warehouse Material',
                                          onClick: () => {
                                              router.push(NKRouter.tempWarehouse.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  key: 'inspected-delivery-stage',
                                  label: 'Inspected Delivery Stage',
                                  onClick: () => {
                                      router.push(NKRouter.inspectedDeliveryStage.list());
                                  },
                                  icon: <BsBoxSeam />,
                              },
                          ]
                        : []),
                    ...(isPurchasingManager
                        ? [
                              {
                                  icon: <FiList />,
                                  key: 'production-plan',
                                  label: 'Production Plan',
                                  onClick: () => {
                                      router.push(NKRouter.productionPlan.list());
                                  },
                              },
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasingPlan',
                                  label: 'Purchasing Plan',
                                  onClick: () => {
                                      router.push(NKRouter.purchasingPlan.list());
                                  },
                              },
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasing',
                                  label: 'Purchasing',
                                  children: [
                                      {
                                          key: 'purchasingTask',
                                          label: 'Purchasing Task',
                                          onClick: () => {
                                              router.push(NKRouter.purchasingTask.list());
                                          },
                                      },
                                      {
                                          key: 'purchasingOrder',
                                          label: 'Purchasing Order',
                                          onClick: () => {
                                              router.push(NKRouter.purchasingOrder.list());
                                          },
                                      },
                                      //   {
                                      //       key: 'poReport',
                                      //       label: 'PO Report',
                                      //       onClick: () => {
                                      //           router.push(NKRouter.poReport.list());
                                      //       },
                                      //   },
                                  ],
                              },
                              {
                                  icon: <LuBoxes />,
                                  key: 'Material',
                                  label: 'Material',
                                  children: [
                                      {
                                          key: 'rawMaterial',
                                          label: 'Raw Material',
                                          onClick: () => {
                                              router.push(NKRouter.rawMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'materialCategory',
                                          label: 'Material Category',
                                          onClick: () => {
                                              router.push(NKRouter.materialCategory.list());
                                          },
                                      },
                                      {
                                          key: 'product',
                                          label: 'Product',
                                          onClick: () => {
                                              router.push(NKRouter.product.list());
                                          },
                                      },
                                      {
                                          key: 'productCategory',
                                          label: 'Product Category',
                                          onClick: () => {
                                              router.push(NKRouter.productCategory.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  key: 'temp-warehouse-request',
                                  label: 'Temp Warehouse Request',
                                  icon: <IoIosGitPullRequest />,
                                  onClick: () => {
                                      router.push(NKRouter.tempWarehouseRequest.list());
                                  },
                              },

                              {
                                  key: 'inspection-request',
                                  label: 'Inspection Request',
                                  icon: <IoIosGitPullRequest />,
                                  onClick: () => {
                                      router.push(NKRouter.inspectionRequest.list());
                                  },
                              },

                              {
                                  icon: <TbBuildingWarehouse />,
                                  key: 'warehousing',
                                  label: 'Warehousing',
                                  children: [
                                      {
                                          key: 'warehouse',
                                          label: 'Warehouse',
                                          onClick: () => {
                                              router.push(NKRouter.warehouse.list());
                                          },
                                      },
                                      {
                                          key: 'main-warehouse-material',
                                          label: 'Main Warehouse Material',
                                          onClick: () => {
                                              router.push(NKRouter.warehouseMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'temp-warehouse-material',
                                          label: 'Temp Warehouse Material',
                                          onClick: () => {
                                              router.push(NKRouter.tempWarehouse.list());
                                          },
                                      },
                                  ],
                              },
                          ]
                        : []),
                    ...(isPurchasingStaff
                        ? [
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasingOrder',
                                  label: 'Purchasing Order',
                                  onClick: () => {
                                      router.push(NKRouter.purchasingOrder.list());
                                  },
                              },
                              //   {
                              //       icon: <RiTicketFill />,
                              //       key: 'poReport',
                              //       label: 'PO Report',
                              //       onClick: () => {
                              //           router.push(NKRouter.poReport.list());
                              //       },
                              //   },
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasing',
                                  label: 'Purchasing',
                                  children: [
                                      {
                                          key: 'purchasingPlan',
                                          label: 'Purchasing Plan',
                                          onClick: () => {
                                              router.push(NKRouter.purchasingPlan.list());
                                          },
                                      },
                                      {
                                          key: 'purchasingTask',
                                          label: 'Purchasing Task',
                                          onClick: () => {
                                              router.push(NKRouter.purchasingTask.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  icon: <HiUserGroup />,
                                  key: 'supplier-account-request',
                                  label: 'Supplier Account Request',
                                  onClick: () => {
                                      router.push(NKRouter.supplierAccountRequest.list());
                                  },
                              },
                              {
                                  icon: <LuBoxes />,
                                  key: 'Material',
                                  label: 'Material',
                                  children: [
                                      {
                                          key: 'rawMaterial',
                                          label: 'Raw Material',
                                          onClick: () => {
                                              router.push(NKRouter.rawMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'materialCategory',
                                          label: 'Material Category',
                                          onClick: () => {
                                              router.push(NKRouter.materialCategory.list());
                                          },
                                      },
                                      {
                                          key: 'product',
                                          label: 'Product',
                                          onClick: () => {
                                              router.push(NKRouter.product.list());
                                          },
                                      },
                                      {
                                          key: 'productCategory',
                                          label: 'Product Category',
                                          onClick: () => {
                                              router.push(NKRouter.productCategory.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  icon: <IoIosGitPullRequest />,
                                  key: 'temp-warehouse-request',
                                  label: 'Temp Warehouse Request',
                                  onClick: () => {
                                      router.push(NKRouter.tempWarehouseRequest.list());
                                  },
                              },

                              {
                                  icon: <IoIosGitPullRequest />,
                                  key: 'inspection-request',
                                  label: 'Inspection Request',
                                  onClick: () => {
                                      router.push(NKRouter.inspectionRequest.list());
                                  },
                              },

                              {
                                  icon: <TbBuildingWarehouse />,
                                  key: 'warehousing',
                                  label: 'Warehousing',
                                  children: [
                                      {
                                          key: 'warehouse',
                                          label: 'Warehouse',
                                          onClick: () => {
                                              router.push(NKRouter.warehouse.list());
                                          },
                                      },
                                      //   {
                                      //       key: 'main-warehouse-material',
                                      //       label: 'Main Warehouse Material',
                                      //       onClick: () => {
                                      //           router.push(NKRouter.warehouseMaterial.list());
                                      //       },
                                      //   },
                                      {
                                          key: 'temp-warehouse-material',
                                          label: 'Temp Warehouse Material',
                                          onClick: () => {
                                              router.push(NKRouter.tempWarehouse.list());
                                          },
                                      },
                                  ],
                              },
                          ]
                        : []),
                    ...(isSupplier
                        ? [
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasingOrder',
                                  label: 'Purchasing Order',
                                  onClick: () => {
                                      router.push(NKRouter.purchasingOrder.list());
                                  },
                              },
                              //   {
                              //       icon: <RiTicketFill />,
                              //       key: 'poReport',
                              //       label: 'PO Report',
                              //       onClick: () => {
                              //           router.push(NKRouter.poReport.list());
                              //       },
                              //   },
                              {
                                  icon: <LuBoxes />,
                                  key: 'Material',
                                  label: 'Material',
                                  children: [
                                      {
                                          key: 'rawMaterial',
                                          label: 'Raw Material',
                                          onClick: () => {
                                              router.push(NKRouter.rawMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'materialCategory',
                                          label: 'Material Category',
                                          onClick: () => {
                                              router.push(NKRouter.materialCategory.list());
                                          },
                                      },
                                      {
                                          key: 'product',
                                          label: 'Product',
                                          onClick: () => {
                                              router.push(NKRouter.product.list());
                                          },
                                      },
                                      {
                                          key: 'productCategory',
                                          label: 'Product Category',
                                          onClick: () => {
                                              router.push(NKRouter.productCategory.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  icon: <IoIosGitPullRequest />,
                                  key: 'temp-warehouse-request',
                                  label: 'Temp Warehouse Request',
                                  onClick: () => {
                                      router.push(NKRouter.tempWarehouseRequest.list());
                                  },
                              },

                              {
                                  icon: <IoIosGitPullRequest />,
                                  key: 'inspection-request',
                                  label: 'Inspection Request',
                                  onClick: () => {
                                      router.push(NKRouter.inspectionRequest.list());
                                  },
                              },
                          ]
                        : []),
                    ...(isWarehouseStaff
                        ? [
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasing',
                                  label: 'Purchasing',
                                  children: [
                                      {
                                          key: 'purchasingOrder',
                                          label: 'Purchasing Order',
                                          onClick: () => {
                                              router.push(NKRouter.purchasingOrder.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  icon: <LuBoxes />,
                                  key: 'Material',
                                  label: 'Material',
                                  children: [
                                      {
                                          key: 'rawMaterial',
                                          label: 'Raw Material',
                                          onClick: () => {
                                              router.push(NKRouter.rawMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'materialCategory',
                                          label: 'Material Category',
                                          onClick: () => {
                                              router.push(NKRouter.materialCategory.list());
                                          },
                                      },
                                      {
                                          key: 'product',
                                          label: 'Product',
                                          onClick: () => {
                                              router.push(NKRouter.product.list());
                                          },
                                      },
                                      {
                                          key: 'productCategory',
                                          label: 'Product Category',
                                          onClick: () => {
                                              router.push(NKRouter.productCategory.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  key: 'temp-warehouse-request',
                                  label: 'Temp Warehouse Request',
                                  icon: <IoIosGitPullRequest />,
                                  onClick: () => {
                                      router.push(NKRouter.tempWarehouseRequest.list());
                                  },
                              },

                              {
                                  icon: <TbBuildingWarehouse />,
                                  key: 'warehousing',
                                  label: 'Warehousing',
                                  children: [
                                      {
                                          key: 'warehouse',
                                          label: 'Warehouse',
                                          onClick: () => {
                                              router.push(NKRouter.warehouse.list());
                                          },
                                      },
                                      {
                                          key: 'main-warehouse-material',
                                          label: 'Main Warehouse Material',
                                          onClick: () => {
                                              router.push(NKRouter.warehouseMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'temp-warehouse-material',
                                          label: 'Temp Warehouse Material',
                                          onClick: () => {
                                              router.push(NKRouter.tempWarehouse.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  key: 'inspected-delivery-stage',
                                  label: 'Inspected Delivery Stage',
                                  onClick: () => {
                                      router.push(NKRouter.inspectedDeliveryStage.list());
                                  },
                                  icon: <BsBoxSeam />,
                              },
                          ]
                        : []),
                    ...(isInspector
                        ? [
                              {
                                  icon: <RiFileList3Line />,
                                  key: 'purchasing',
                                  label: 'Purchasing',
                                  children: [
                                      {
                                          key: 'purchasingOrder',
                                          label: 'Purchasing Order',
                                          onClick: () => {
                                              router.push(NKRouter.purchasingOrder.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  icon: <LuBoxes />,
                                  key: 'Material',
                                  label: 'Material',
                                  children: [
                                      {
                                          key: 'rawMaterial',
                                          label: 'Raw Material',
                                          onClick: () => {
                                              router.push(NKRouter.rawMaterial.list());
                                          },
                                      },
                                      {
                                          key: 'materialCategory',
                                          label: 'Material Category',
                                          onClick: () => {
                                              router.push(NKRouter.materialCategory.list());
                                          },
                                      },
                                      {
                                          key: 'product',
                                          label: 'Product',
                                          onClick: () => {
                                              router.push(NKRouter.product.list());
                                          },
                                      },
                                      {
                                          key: 'productCategory',
                                          label: 'Product Category',
                                          onClick: () => {
                                              router.push(NKRouter.productCategory.list());
                                          },
                                      },
                                  ],
                              },
                              {
                                  key: 'inspection-request',
                                  label: 'Inspection Request',
                                  onClick: () => {
                                      router.push(NKRouter.inspectionRequest.list());
                                  },
                                  icon: <IoIosGitPullRequest />,
                              },

                              {
                                  icon: <TbBuildingWarehouse />,
                                  key: 'warehousing',
                                  label: 'Warehousing',
                                  children: [
                                      {
                                          key: 'warehouse',
                                          label: 'Warehouse',
                                          onClick: () => {
                                              router.push(NKRouter.warehouse.list());
                                          },
                                      },
                                  ],
                              },
                          ]
                        : []),
                ],
            }}
        >
            {children}
        </MenuDashboardContext.Provider>
    );
};

export const useMenuDashboard = () => React.useContext(MenuDashboardContext);
