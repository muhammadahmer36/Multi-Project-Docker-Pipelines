import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {
  ReactWindowList,
} from 'components';
import { NotesProps } from 'pages/TimeOffCalendar/types';
import { heightForTimeOffNotesContainer, heightForTimeOffNotesContainerManager } from 'appConstants';
import { UserRole } from 'common/types/types';
import Item from './Item';
import DetailHeader from './Header';
import styles from './Notes.module.scss';

export default function Notes(props: NotesProps) {
  const { notesDetail, currentRole } = props;
  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(notesDetail.length).fill(false));

  const gridMaximumHeight = currentRole === UserRole.Manager
    ? heightForTimeOffNotesContainerManager : heightForTimeOffNotesContainer;

  const gridBoxClass = currentRole === UserRole.Manager ? styles.gridBoxForManager : styles.gridBoxForEmployee;

  const containerClass = currentRole === UserRole.Manager ? styles.listBoxForManager : styles.listBox;

  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = notesDetail[index];
    return (
      <div key={index} style={style}>
        <Item
          item={item}
          index={index}
        />
      </div>
    );
  };

  const onExpandAll = () => {
    setExpandedItems(new Array(notesDetail.length).fill(true));
  };

  const onCollapseAll = () => {
    setExpandedItems(new Array(notesDetail.length).fill(false));
  };

  return (
    <div className={styles.container}>
      <Box
        className={gridBoxClass}
        ml={2}
        mr={2}
      >
        <div
          className={styles.gridContainer}
          style={{
            boxSizing: 'border-box',
            height: `calc(100vh - ${gridMaximumHeight}px)`,
          }}
        >
          <DetailHeader
            onExpand={onExpandAll}
            onCollapse={onCollapseAll}
            expandedItems={expandedItems}
          />
          <Box
            className={containerClass}
          >
            {
              notesDetail.length > 0 && (
                <ReactWindowList
                  setExpandedItems={setExpandedItems}
                  expandedItems={expandedItems}
                  data={notesDetail}
                  rowRenderer={rowRenderer}
                />
              )
            }
          </Box>
        </div>
      </Box>
    </div>
  );
}
