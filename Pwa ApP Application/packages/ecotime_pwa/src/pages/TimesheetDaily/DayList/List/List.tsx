import React, {
  useState,
  useCallback,
  useRef,
  RefObject,
  useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import { VariableSizeList } from 'react-window';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { getDailyDetailsList } from 'pages/TimesheetDaily/selectors';
import Item from '../Item';

export interface ListContextType {
  // eslint-disable-next-line no-unused-vars
  setSize: (index: number, size: number) => void;

}

interface Props {
  listContainerRef: RefObject<HTMLDivElement>
}

export const ListContext = React.createContext<ListContextType>({
  setSize: () => {},
});

export default function List(props: Props) {
  const { listContainerRef } = props;
  const data = useSelector(getDailyDetailsList) || [];
  const sizeMap = useRef<{ [key: number]: number }>({});
  const listRef = useRef<VariableSizeList>(null);
  const [parentHeight, setParentHeight] = useState(0);

  const getParentHeight = () => {
    if (listContainerRef.current) {
      setParentHeight(listContainerRef.current.clientHeight);
    }
  };
  useEffect(() => {
    getParentHeight();
    window.addEventListener('resize', getParentHeight);
    return () => {
      window.removeEventListener('resize', getParentHeight);
    };
  }, []);

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };

    if (listRef && listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  }, [listRef, JSON.stringify(sizeMap)]);

  const getSize = useCallback((index: number) => sizeMap.current[index] || 200, []);

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];

    return (
      <div
        key={index}
        style={{
          ...style,
        }}
      >
        <Item
          item={item}
          index={index}
        />
      </div>
    );
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    setSize,
  };
  return (
    <ListContext.Provider value={value}>
      <AutoSizer disableHeight>
        {({ width }: HorizontalSize) => (

          <VariableSizeList
            ref={listRef}
            height={parentHeight}
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
