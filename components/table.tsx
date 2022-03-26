/* eslint-disable jsx-a11y/interactive-supports-focus */
import clsx from 'clsx';
import dayjs from 'dayjs';
import React, { memo, useEffect, useRef, useState } from 'react';

import useSortableData from '../hooks/useSortableData';
import Typography from './typography';

export interface Columns {
  id: number;
  name: string;
  type: 'number' | 'string' | 'date';
  clickable?: boolean;
  // eslint-disable-next-line no-unused-vars
  clickEvent?: (value: any) => void;
}

interface Props {
  rows: any[];
  columns: Columns[];
  defaultKey?: string;
  options?: {
    rowsSelectable?: boolean;
    title?: string;
    search?: {
      enabled: boolean;
      sortKey: string;
    };
    delete: {
      enable: boolean;
      // eslint-disable-next-line no-unused-vars
      function?: (id: (string | number)[]) => void;
    }
  };
}

const Table: React.FC<Props> = ({
  rows,
  columns,
  options,
  defaultKey,
}: Props) => {
  const ref = useRef<HTMLTableElement>(null);
  const [selected, setSelected] = useState<(number | string)[]>([]);
  const [search, setSearch] = useState<string>('');
  const { items, requestSort, sortConfig } = useSortableData(rows);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  useEffect(() => {
    if (!options || !options.search || !options.search.enabled) {
      setFilteredRows(items);
    }

    if (!options || !options.search) return () => {};

    const newArray = items.filter((value) =>
      // eslint-disable-next-line prettier/prettier
      String(value[options.search!.sortKey])
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredRows(newArray);


    return () => {}
  }, [search, items, rows, options]);

  useEffect(() => {
    if (defaultKey) {
      requestSort(defaultKey, 'descending');
    }
  }, [defaultKey, requestSort]);

  const handleSelections = (id: string | number) => {
    if (selected.includes(id)) {
      const index = selected.findIndex((value) => value === id);
      const newArray = [...selected];

      newArray.splice(index, 1);

      setSelected(newArray);
    } else {
      setSelected((prevState) => [id, ...prevState]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === items.length) {
      setSelected([]);
      return;
    }
    items.forEach((value) => {
      if (!selected.includes(value.id)) {
        handleSelections(value.id);
      }
    });
  };

  return (
    <>
      <div className='flex items-center'>
        {options && options.title && (
          <div className='p-3 text-white bg-dark-components rounded-t'>
            <Typography variant='h3'>{options.title}</Typography>
          </div>
        )}
        <div className='flex flex-grow items-center '>
          {options && options.delete.enable && (
            <button
              className='flex items-center ml-4 text-white disabled:text-gray-500'
              disabled={!selected.length}
              tabIndex={0}
              type='button'
              onClick={() => {
                if (options && options.delete.enable && options.delete.function) {
                  options.delete.function(selected);
                  setSelected([]);
                }
              }}>
              <span className='material-icons-outlined mr-2'>delete</span>
              Delete
            </button>
          )}
        </div>
        {options && options.search && options.search.enabled && (
          <div className='relative text-white'>
            <form>
              <input
                className='relative pr-16 px-4 py-2 ml-4 w-11/12  bg-dark-components rounded focus:outline-none'
                placeholder='search...'
                type='text'
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
              <button
                className='absolute right-0 top-0 flex items-center justify-center bg-black w-14 h-full rounded-none rounded-r shadow-none'
                tabIndex={0}
                type='submit'>
                <span className='material-icons-outlined'>search</span>
              </button>
            </form>
          </div>
        )}
      </div>
      <div className='overflow-x-auto'>
        <table ref={ref} className='table-auto text-white  min-w-full'>
          <thead className='p-3 h-10  bg-dark-components'>
            <tr>
              {options && options.rowsSelectable && (
                <th className='pl-2 pt-2 w-4'>
                  <button type='button' onClick={() => handleSelectAll()}>
                    <span className='material-icons-outlined'>
                      {selected.length === items.length && 'check_box'}
                      {!selected.length && 'check_box_outline_blank'}
                      {!!selected.length &&
                        selected.length !== items.length &&
                        'indeterminate_check_box'}
                    </span>
                  </button>
                </th>
              )}
              {columns.map((header) => (
                <th key={header.id} className='p-4'>
                  <button
                    className={clsx(['flex flex-row place-items-center'])}
                    type='button'
                    onClick={() => requestSort(header.name)}>
                    <Typography className='!font-semibold' variant='body'>
                      {header.name}
                    </Typography>
                    {getClassNamesFor(header.name) === 'ascending' && (
                      <span className='material-icons-outlined'>
                        arrow_drop_down
                      </span>
                    )}
                    {getClassNamesFor(header.name) === 'descending' && (
                      <span className='material-icons-outlined transform rotate-180'>
                        arrow_drop_down
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=' table-auto h-48 overflow-hidden bg-dark-components'>
            {!!items.length &&
              filteredRows.map((row: any) => (
                <tr
                  key={row.id}
                  className={`hover:bg-dark-background cursor-pointer space-x-2 ${row.style}`}
                  onClick={row.onClick}
                  onMouseEnter={row.onMouseEnter}
                  onMouseLeave={row.onMouseLeave}>
                  {options && (
                    <td>
                      <button
                        className='ml-2'
                        type='button'
                        onClick={() => handleSelections(row.id)}>
                        <span className='material-icons-outlined'>
                          {selected.includes(row.id)
                            ? 'check_box'
                            : ' check_box_outline_blank'}
                        </span>
                      </button>
                    </td>
                  )}
                  {columns.map((header) => (
                    <td key={header.id} className={clsx('p-3', 'text-left')}>
                      {header.clickable ? (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <a
                          className='hover:underline decoration-sky-500'
                          role='button'
                          onClick={() => header.clickEvent!(row.id)}>
                          <Typography variant='light'>
                            {header.type === 'date'
                              ? dayjs(row[header.name]).format('MMMM, DD YYYY')
                              : row[header.name]}
                          </Typography>
                        </a>
                      ) : (
                        <Typography variant='light'>
                          {header.type === 'date'
                            ? dayjs(row[header.name]).format('MMMM, DD YYYY')
                            : row[header.name]}
                        </Typography>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            <tr>
              {!filteredRows.length && (
                <td className='p-2 text-left'>
                  <Typography variant='light'>No Results</Typography>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

Table.defaultProps = {
  defaultKey: undefined,
  options: undefined
};


export default memo(Table);
