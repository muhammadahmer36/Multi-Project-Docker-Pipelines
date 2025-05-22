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
import { useTranslation } from 'react-i18next';
import { getCalculatedList } from 'pages/Timesheet/selectors';
import Item from '../Item';
import styles from './List.module.scss';

export interface ListContextType {
  onExpandAll: () => void,
  onCollapseAll: () => void,
  // eslint-disable-next-line no-unused-vars
  setSize: (index: number, size: number) => void;
  expandedItems: boolean[];
  setExpandedItems: React.Dispatch<React.SetStateAction<boolean[]>>;
  expand: boolean;

}

interface Props {
  listContainerRef: RefObject<HTMLDivElement>

}

export const ListContext = React.createContext<ListContextType>({
  onExpandAll: () => {},
  onCollapseAll: () => {},
  setSize: () => {},
  setExpandedItems: () => {},
  expandedItems: [],
  expand: false,
});

export default function List(props: Props) {
  const { listContainerRef } = props;
  const [t] = useTranslation();
  const data = useSelector(getCalculatedList) || [];
  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(data.length).fill(false));
  const sizeMap = useRef<{ [key: number]: number }>({});
  const listRef = useRef<VariableSizeList>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const [expand, setExpand] = useState(false);

  const getParentHeight = () => {
    if (listContainerRef.current) {
      setParentHeight(listContainerRef.current.clientHeight - (48 * 2));
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

  useEffect(() => {
    const allCollapsed = expandedItems.every((item) => item === false);
    if (allCollapsed) {
      setExpand(false);
    }
  }, [JSON.stringify(expandedItems)]);

  useEffect(() => {
    const allExpanded = expandedItems.every((item) => item === true);
    if (allExpanded) {
      setExpand(true);
    }
  }, [JSON.stringify(expandedItems)]);

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];

    return (
      <div key={index} style={{ ...style }}>
        <Item
          item={item}
          index={index}
        />
      </div>
    );
  };
  const onExpandAll = () => {
    setExpandedItems(new Array(data.length).fill(true));
  };

  const onCollapseAll = () => {
    setExpandedItems(new Array(data.length).fill(false));
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    setSize, setExpandedItems, expandedItems, onCollapseAll, onExpandAll, expand,
  };

  return (
    <>
      {data.length < 1
      && (
      <div className={styles.noDataFound}>
        {t('noDataFound')}
      </div>
      )}
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
    </>
  );
}
