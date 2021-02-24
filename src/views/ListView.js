import React, { useEffect, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import Card from "../components/Card";
import FormInputs from "../components/FormInputs";

// ListView.prototype = {
//     items: PropTypes, headers, title, category, actionItemStart, actionItemAfterIndex , actionItemEnd
// }

/**
 * @param Array items
 * @param Array headers
 * @param String title
 * @param String category
 * @param Bool controlledPage
 * @param Bool selfedPage
 * @param Number page
 * @param Number limit
 * @param callback handlePageChange
 * @param callback actionItemStart(item , i)
 * @param callback actionItemEnd(item, i)
 * @param Array actionOnItemAt = [{index, callback(item, i)}]
 * @param Array renderItemAtIndex = [{ index, header, action: (item, i) => { } }]
 */

const ListView = (props) => {
  const {
    items: rawItems = [],
    headers = [],
    title = "",
    category = "",
    page = 1,
    limit = 1000,
    handlePageChange = (page, limit) => {},
    actionItemStart = (item, rowIndex) => {},
    actionItemEnd = (item, rowIndex) => {},
    actionOnItemAt = [{ index: -1, action: (item, colIndex, rowIndex) => {} }],
    renderItemAtIndex = [
      { index: -1, header: "", action: (item, colIndex, rowIndex) => {} },
    ],
    footers = [],

    cardProps,
    cardStyle,
    tableProps,
    tableStyle,
    tableHeadStyle,
    tableBodyStyle,
    tableFooterStyle
  } = props;

  const initState = {
    sort: {
      headerName: "id",
      direction: "down",
    },
    items: [],
    rowsPerPage: 20,
    currentPage: 1,
    noMoreData: false,
    numOfPageItems: 5,
  };
  const [state, setState] = useState(initState);
  const {
    items,
    sort,
    rowsPerPage,
    currentPage,
    noMoreData,
    numOfPageItems,
  } = state;

  let newHeaders = [];
  let newFooters = [];

  let k = 0;

  headers.map((header, headerIndex) => {
    let indexes = [];

    renderItemAtIndex.map((item, itemIndex) => {
      let newHeader = item.header;

      indexes = [...indexes, item.index];

      newHeaders[item.index] = newHeader;
      newFooters[item.index] = "";
    });

    k = indexes.some((value) => value == k) ? k + 1 : k + 0;

    newHeaders[k] = headers[headerIndex];
    newFooters[k] = footers[headerIndex];

    k++;
  });

  let max = currentPage * rowsPerPage;
  let min = max - rowsPerPage;
  const pagedItems = items.filter((item, i) => i >= min && i < max);

  const pagedItemsLength = pagedItems.length;
  const itemsLength = items.length;
  const currentTotalPages = Math.ceil(itemsLength / rowsPerPage);
  const isPrevPageBtnDisabled = currentPage - 1 === 0;
  const isNextPageBtnDisabled =
    pagedItemsLength < rowsPerPage || pagedItemsLength == 0;
  const prevRangeCenterPage = currentPage - Math.ceil(numOfPageItems / 2);
  useEffect(() => {
    const rawItemsIds = rawItems.map((item) => item.id);
    const itemsIds = items.map((item) => item.id);

    if (
      items.length == 0 ||
      rawItems.length > items.length ||
      itemsIds.some((itemId) => rawItemsIds.indexOf(itemId) < 0) ||
      rawItemsIds.some((rawItemId) => itemsIds.indexOf(rawItemId) < 0)
    ) {
      setState((prev) => {
        const prevIdObjs = prev.items.map((item) => item.id);
        const newRawItems = rawItems.filter(
          (item) => prevIdObjs.indexOf(item.id) < 0
        );

        return {
          ...state,
          items: [...prev.items, ...newRawItems],
          noMoreData: newRawItems.length === 0,
        };
      });
    }

    return () => {
      //componentWillUnmount
    };
  }, [rawItems]);

  const handleSort = (headerIndex, headerName) => {
    setState((prev) => {
      const direction = state.sort.direction == "down" ? "up" : "down";
      const sortedItems = items.sort((a, b) => {
        const keys = Object.keys(items[0]);
        const key = keys[headers.indexOf(headerName) + 1];

        return direction == "down"
          ? a[key] > b[key]
            ? 1
            : -1
          : a[key] > b[key]
          ? -1
          : 1;
      });

      return {
        ...state,
        sort: {
          headerName,
          direction,
        },
        items: sortedItems,
      };
    });
  };

  const handleFilter = (filterValue) => {
    const keys = Object.keys(rawItems[0]);

    const filteredItems = rawItems.filter((item) => {
      for (let i = 0; i < keys.length; i++) {
        let check = item[keys[i]];
        check =
          typeof check == "string"
            ? check
            : typeof check == "number"
            ? JSON.stringify(check)
            : "";

        if (check.includes(filterValue)) {
          return true;
        }
      }

      return false;
    });

    setState({ ...state, items: filteredItems });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    newRowsPerPage = newRowsPerPage ?? 0;
    setState({ ...state, rowsPerPage: newRowsPerPage });
  };

  const handlePageChangeLocal = (newPageNum) => {
    if (max > itemsLength) {
      handlePageChange(page + 1, limit);
    }
    setState({ ...state, currentPage: newPageNum });
  };

  const gotoPrevPage = () => {
    const newPageNum = currentPage - 1;
    handlePageChangeLocal(newPageNum);
  };

  const gotoNextPage = () => {
    const newPageNum = currentPage + 1;
    handlePageChangeLocal(newPageNum);
  };

  return (
    <Card
      title={title}
      category={category}
      {...cardProps}
      style={cardStyle}
      
      content={
        <div style={{ overflowX: "scroll" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <form>
              <FormInputs
                ncols={["col-md-6", "col-md-4"]}
                properties={[
                  {
                    id: "filter",
                    label: "Filter",
                    type: "text",
                    bsClass: "form-control",
                    placeholder: "Filter",
                    onChange: (e) => {
                      let value = e.currentTarget.value;
                      handleFilter(value);
                    },
                  },
                  {
                    label: "Rows per page",
                    type: "number",
                    bsClass: "form-control",
                    defaultValue: rowsPerPage,
                    onChange: (e) => {
                      let value = e.currentTarget.value;
                      handleRowsPerPageChange(value);
                    },
                  },
                ]}
              />
            </form>
          </div>

          <Table {...tableProps} style={tableStyle}>
            <thead tableHeadStyle = {tableHeadStyle} >
              <tr>
                <th>
                  <a
                    href={`#SortByS/N`}
                    onClick={() => {
                      handleSort(null, "S/N");
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      color: "inherit",
                    }}
                  >
                    S/N
                    <i
                      className={`pe-7s-angle-${
                        "S/N" == state.sort.headerName
                          ? state.sort.direction
                          : initState.sort.direction
                      }`}
                    />
                  </a>
                </th>
                {newHeaders.map((newheader, headerIndex) => {
                  const sortDirection =
                    newheader == state.sort.headerName
                      ? state.sort.direction
                      : initState.sort.direction;
                  return (
                    newheader != "id" && (
                      <th key={headerIndex}>
                        <a
                          href={`#SortBy${newheader}`}
                          onClick={() => {
                            handleSort(headerIndex, newheader);
                          }}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            color: "inherit",
                          }}
                        >
                          {newheader}
                          <i className={`pe-7s-angle-${sortDirection}`} />
                        </a>
                      </th>
                    )
                  );
                })}
              </tr>
            </thead>

            <tbody style={tableBodyStyle}>
              {pagedItems &&
                pagedItems.map((row, rowIndex) => {
                  return (
                    <tr key={rowIndex}>
                      {actionItemStart(row, rowIndex)}

                      <td>{min + rowIndex + 1}</td>

                      {Object.keys(row).map((col, colIndex) => {
                        for (let l = 0; l < renderItemAtIndex.length; l++) {
                          const itemAtIndexElement = renderItemAtIndex[l];

                          if (itemAtIndexElement.index == colIndex) {
                            let tag = itemAtIndexElement.action(
                              row,
                              colIndex,
                              rowIndex
                            );

                            return (
                              col != "id" && (
                                <React.Fragment key={colIndex}>
                                  {tag}
                                  <td>{row[col]}</td>
                                </React.Fragment>
                              )
                            );
                          }
                        }

                        for (let m = 0; m < actionOnItemAt.length; m++) {
                          let actionOnItemElemtent = actionOnItemAt[m];

                          if (actionOnItemElemtent.index == colIndex) {
                            return actionOnItemElemtent.action(
                              row,
                              colIndex,
                              rowIndex
                            );
                          }
                        }

                        return (
                          col != "id" &&
                          (!col.includes("ID", 0) ||
                            col == "referenceID" ||
                            col == "cardID") && (
                            <td key={colIndex}>{row[col]}</td>
                          )
                        );
                      })}

                      {actionItemEnd(row, rowIndex)}
                    </tr>
                  );
                })}

              <tr style = {tableFooterStyle}>
                <td></td>
                {newFooters &&
                  newFooters.map((footer, x) => {
                    return <td key={x}>{footer}</td>;
                  })}
              </tr>
            </tbody>
          </Table>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination>
              <Pagination.First
                href={`#${currentPage}`}
                onClick={() => {
                  handlePageChangeLocal(1);
                }}
              />
              <Pagination.Prev
                href={`#${currentPage}`}
                disabled={isPrevPageBtnDisabled}
                onClick={gotoPrevPage}
              />
              <Pagination.Item
                eventKey="1"
                href={`#${currentPage}`}
                disabled={isPrevPageBtnDisabled}
                onClick={gotoPrevPage}
              >
                &larr; Previous Page
              </Pagination.Item>

              {prevRangeCenterPage > 0 && (
                <Pagination.Ellipsis
                  onClick={() => {
                    handlePageChangeLocal(prevRangeCenterPage);
                  }}
                />
              )}

              {itemsLength > 0 &&
                rowsPerPage > 0 &&
                Array(currentTotalPages)
                  .fill(0)
                  .map((item, i) => {
                    const currPage = i + 1;

                    return currentPage + Math.ceil(numOfPageItems / 2) >
                      currPage &&
                      currPage > currentPage - Math.ceil(numOfPageItems / 2) ? (
                      <Pagination.Item
                        key={i}
                        eventkey={`${currPage + 1}`}
                        href={`#${currPage}`}
                        active={currPage == currentPage}
                        onClick={() => {
                          handlePageChangeLocal(currPage);
                        }}
                      >
                        {currPage}
                      </Pagination.Item>
                    ) : null;
                  })}

              <Pagination.Ellipsis
                onClick={() => {
                  !noMoreData && handlePageChange(page + 1, limit);
                }}
              />

              <Pagination.Item
                eventKey={`${
                  itemsLength > 0 && rowsPerPage > 0
                    ? Math.ceil(itemsLength / rowsPerPage) + 2
                    : 2
                }`}
                href={`#${currentPage}`}
                disabled={isNextPageBtnDisabled}
                onClick={gotoNextPage}
              >
                Next Page &rarr;
              </Pagination.Item>
              <Pagination.Next
                href={`#${currentPage}`}
                disabled={isNextPageBtnDisabled}
                onClick={gotoNextPage}
              />
              <Pagination.Last
                href={`#${currentPage}`}
                onClick={() => {
                  handlePageChangeLocal(currentTotalPages);
                }}
              />
            </Pagination>
          </div>
        </div>
      }
    />
  );
};

export default ListView;
