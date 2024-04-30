import * as React from 'react';

import { Button, ButtonProps, Drawer } from 'antd';

interface DrawerBuilderProps {
    btnLabel?: string | React.ReactNode;
    drawerTitle?: string;
    btnProps?: ButtonProps;
    children: React.ReactNode | ((close: () => void) => React.ReactNode);
    className?: string;
    width?: string;
}

const DrawerBuilder: React.FC<DrawerBuilderProps> = ({ btnLabel, drawerTitle, btnProps, children, className, width }) => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    return (
        <div>
            <Button {...btnProps} onClick={() => setIsDrawerOpen(true)}>
                {btnLabel}
            </Button>
            <Drawer width={width} className={className} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerTitle}>
                {typeof children === 'function' ? children(() => setIsDrawerOpen(false)) : children}
            </Drawer>
        </div>
    );
};

export default DrawerBuilder;
