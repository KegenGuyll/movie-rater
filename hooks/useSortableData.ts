import { useMemo, useState } from 'react';

type IDirection = 'ascending' | 'descending';

interface IConfig {
  key: any;
  direction: IDirection;
}

const useSortableData = (items: any, config = null) => {
  const [sortConfig, setSortConfig] = useState<IConfig | null>(config);

  const sortedItems = useMemo(() => {
    const sortedRows = [...items];
    if (sortConfig !== null) {
      sortedRows.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedRows;
  }, [items, sortConfig]);

  const requestSort = (key: string, dir: IDirection = 'ascending') => {
    let direction: IDirection = dir;

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ direction, key });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export default useSortableData;
