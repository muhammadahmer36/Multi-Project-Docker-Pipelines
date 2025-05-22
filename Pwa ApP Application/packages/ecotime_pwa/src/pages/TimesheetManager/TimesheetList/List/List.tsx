import React, {
  useState,
  useCallback,
  useRef,
  RefObject,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VariableSizeList } from 'react-window';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { getCheck, getCheckedItems, getEmployeeDetailsList } from 'pages/TimesheetManager/selectors';
import { setCheck, setCheckedItems as setCheckedItemsAction } from 'pages/TimesheetManager/slice';
import Item from '../Item';

export interface ListContextType {
  onCheckAll: () => void,
  onUnCheckAll: () => void,
  // eslint-disable-next-line no-unused-vars
  setSize: (index: number, size: number) => void;
  checkedItems: boolean[];
  // eslint-disable-next-line no-unused-vars
  setCheckedItems: (checkedItems:boolean[]) => void
  checked: boolean,
  // eslint-disable-next-line no-unused-vars
  setChecked: (check:boolean) => void
}

export const ListContext = React.createContext<ListContextType>({
  setSize: () => {},
  onCheckAll: () => {},
  onUnCheckAll: () => {},
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  setCheckedItems: (checkedItems:boolean[]) => {},
  checkedItems: [],
  checked: false,
  setChecked: () => {},
});
interface Props {
  listContainerRef: RefObject<HTMLDivElement>
}

export default function List(props: Props) {
  const { listContainerRef } = props;
  const data = useSelector(getEmployeeDetailsList) || [];
  const dispatch = useDispatch();
  const sizeMap = useRef<{ [key: number]: number }>({});
  const listRef = useRef<VariableSizeList>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const checkedItems = useSelector(getCheckedItems);
  const checked = useSelector(getCheck);

  const getParentHeight = useCallback(() => {
    if (listContainerRef.current) {
      setParentHeight(listContainerRef.current.clientHeight);
    }
  }, []);

  const setCheckedItems = (checkedItems: boolean[]) => {
    dispatch(setCheckedItemsAction(checkedItems));
  };

  const setChecked = (checkedItems: boolean) => {
    dispatch(setCheck(checkedItems));
  };

  const onCheckAll = useCallback(() => {
    setCheckedItems(new Array(data.length).fill(true));
  }, [checked]);

  const onUnCheckAll = useCallback(() => {
    setCheckedItems(new Array(data.length).fill(false));
  }, [checked, data.length]);

  useEffect(() => {
    if (data.length > 1) {
      onUnCheckAll();
    }
  }, [data.length]);

  useEffect(() => {
    if (checked) {
      onCheckAll();
    } else {
      onUnCheckAll();
    }
  }, [checked]);

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
    checkedItems,
    setCheckedItems,
    onCheckAll,
    onUnCheckAll,
    setChecked,
    checked,
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
