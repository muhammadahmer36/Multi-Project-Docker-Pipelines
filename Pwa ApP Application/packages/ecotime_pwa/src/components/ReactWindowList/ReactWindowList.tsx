import React, {
  useState,
  useCallback,
  useRef,
} from 'react';
import { VariableSizeList } from 'react-window';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { footerHeight } from 'appConstants';

export interface ListContextType {
  // eslint-disable-next-line no-unused-vars
  setSize: (index: number, size: number) => void;
  expandedItems: boolean[]
  setExpandedItems: React.Dispatch<React.SetStateAction<boolean[]>>;

}

export const ListContext = React.createContext<ListContextType>({
  setSize: () => { },
  setExpandedItems: () => { },
  expandedItems: [],
});

interface ReactWindowListProps<T> {
  data: T[];
  expandedItems: boolean[];
  setExpandedItems: React.Dispatch<React.SetStateAction<boolean[]>>;
  // eslint-disable-next-line no-unused-vars
  rowRenderer: ({ index, style }: { index: number; style: React.CSSProperties }) => React.ReactElement;
}

export default function ReactWindowList<T>({
  data, expandedItems, setExpandedItems, rowRenderer,
}: ReactWindowListProps<T>) {
  const listHeightRef = useRef<number>(0);
  const [height, setHeight] = useState<number>(500);
  const sizeMap = useRef<{ [key: number]: number }>({});
  const listRef = useRef<VariableSizeList>(null);

  const calculateTotalHeight = useCallback(() => {
    let totalHeight = 0;
    for (let i = 0; i < data.length; i += 1) {
      totalHeight += sizeMap.current[i] || 200;
    }
    listHeightRef.current = totalHeight;
    setHeight(totalHeight);
  }, [JSON.stringify(sizeMap)]);

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    calculateTotalHeight();

    if (listRef && listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  }, [listRef, JSON.stringify(sizeMap)]);

  const getSize = useCallback((index: number) => sizeMap.current[index] || 200, []);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = { setSize, setExpandedItems, expandedItems };

  return (
    <ListContext.Provider value={value}>
      <AutoSizer disableHeight>
        {({ width }: HorizontalSize) => (
          <VariableSizeList
            ref={listRef}
            height={height + footerHeight}
            width={width}
            itemCount={data.length}
            itemSize={getSize}
          >
            {rowRenderer}
          </VariableSizeList>
        )}
      </AutoSizer>
    </ListContext.Provider>
  );
}
