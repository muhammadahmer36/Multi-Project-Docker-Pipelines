import React, {
  useState,
  useCallback,
  useRef,
  RefObject,
  useEffect,
} from 'react';
import { VariableSizeList } from 'react-window';
import AutoSizer, { HorizontalSize } from 'react-virtualized-auto-sizer';
import { useTranslation } from 'react-i18next';
import { CertifyItem } from 'pages/TimesheetCertifyUncertify/types';
import { useSelector } from 'react-redux';
import { getDate } from 'pages/TimesheetCertifyUncertify/selectors';
import Item from '../Item';
import styles from './List.module.scss';
import Header from '../Header';

export interface ListContextType {
  onExpandAll: () => void,
  onCollapseAll: () => void,
  // eslint-disable-next-line no-unused-vars
  setSize: (index: number, size: number) => void;
  expandedItems: boolean[];
  setExpandedItems: React.Dispatch<React.SetStateAction<boolean[]>>;
  expand: boolean,
}

interface Props {
  listContainerRef: RefObject<HTMLDivElement>
  data: CertifyItem[]
}

export const ListContext = React.createContext<ListContextType>({
  setSize: () => {},
  onExpandAll: () => {},
  onCollapseAll: () => {},
  setExpandedItems: () => {},
  expandedItems: [],
  expand: false,

});

export default function List(props: Props) {
  const { listContainerRef, data = [] } = props;
  const [t] = useTranslation();
  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(data.length).fill(false));
  const sizeMap = useRef<{ [key: number]: number }>({});
  const listRef = useRef<VariableSizeList>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const [expand, setExpand] = useState(false);
  const date = useSelector(getDate);

  useEffect(() => {
    setExpandedItems(new Array(data.length).fill(false));
  }, [data.length]);

  const getParentHeight = () => {
    if (listContainerRef.current) {
      setParentHeight(listContainerRef.current.clientHeight - (48));
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

  const onCollapseAll = useCallback(() => {
    setExpandedItems(new Array(data.length).fill(false));
  }, []);

  useEffect(() => {
    onCollapseAll();
  }, [date]);

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

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    setSize, setExpandedItems, expandedItems, onExpandAll, onCollapseAll, expand,
  };

  if (data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <ListContext.Provider value={value}>
            <Header expandIconVisible={false} />
          </ListContext.Provider>
        </div>
        <div className={styles.noDataFoundContainer}>
          <div className={styles.noDataFound}>
            {t('noPayPeriodFound')}
          </div>
        </div>
      </div>
    );
  }
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
