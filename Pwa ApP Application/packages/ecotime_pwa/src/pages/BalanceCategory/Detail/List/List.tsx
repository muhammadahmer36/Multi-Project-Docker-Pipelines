import React, {
  useState,
  useCallback,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { VariableSizeList } from 'react-window';
import { getBalanceDetail } from 'pages/BalanceCategory/selectors';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { useTranslation } from 'react-i18next';
import { footerHeight } from 'appConstants';
import Item from '../Item';
import Header from '../Header/Header';
import styles from './List.module.scss';

export interface ListContextType {
  // eslint-disable-next-line no-unused-vars
  setSize: (index: number, size: number) => void;
  expandedItems: boolean[]
  setExpandedItems: React.Dispatch<React.SetStateAction<boolean[]>>;

}

export const ListContext = React.createContext<ListContextType>({
  setSize: () => {},
  setExpandedItems: () => {},
  expandedItems: [],
});

export default function List() {
  const [t] = useTranslation();
  const data = useSelector(getBalanceDetail) || [];
  const listHeightRef = useRef<number>(0);
  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(data.length).fill(false));
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

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];

    return (
      <div key={index} style={{ ...style }}>
        <Item
          item={item}
          lastRow={data.length - 1 === index}
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
  const value = { setSize, setExpandedItems, expandedItems };

  return (
    <>
      <Header
        onExpand={onExpandAll}
        onCollapse={onCollapseAll}
        expandedItems={expandedItems}
      />
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
    </>
  );
}
