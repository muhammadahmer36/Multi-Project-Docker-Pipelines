/* eslint-disable no-unused-vars */
export interface SideMenuDrawerProps {
    open: boolean;
    closeDrawer: () => void;
    openDrawer: () => void;
    selectedIndex: number;
    handleListItemClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void;
  }
