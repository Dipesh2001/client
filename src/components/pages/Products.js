import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import { useEffect, useMemo, useState } from "react";
import {
  deleteProductAsync,
  fetchProductsAsync,
  resetEditProduct,
} from "../../features/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();
  const { productsList, updateStatus, editProductData } = useSelector(
    (state) => state.products
  );
  const rowDataRef = useRef([]);
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  // const fetchProducts = async () => {
  //   const res = await fetch(`http://localhost:5000/api/getAllProducts`);
  //   const data = await res.json();
  //   setRowData(data.data);
  //   setTotalPages(data.pageCount);
  // };

  //   useEffect(() => {
  //     // fetchProducts();
  //     // gridApi && console.log(gridApi.api.paginationGetTotalPages());
  //     if (gridApi) {
  //       const serverSideDataSource = {
  //         getRows: function (params) {
  //           // Make your API call here to fetch the data based on params
  //           // For example, fetch data from your backend using fetch or axios
  //           fetch(
  //             `http://localhost:5000/api/getAllProducts?page=${currentPage}&size=${pageSize}`
  //           )
  //             .then((response) => response.json())
  //             .then((data) => {
  //               // Update the row data
  //               // setRowData(data.data);
  //               console.log({ data });
  //               // Inform ag-Grid that data is available
  //               params.successCallback(data.data, data.rowsCount);
  //             })
  //             .catch((error) => {
  //               // Handle errors
  //               console.log({ error });
  //               params.failCallback();
  //             });
  //         },
  //       };
  //       console.log({ gridApi });
  //       gridApi.setGridOption("datasource", serverSideDataSource);
  //       gridApi.addEventListener("paginationChanged", (event) =>
  //         setPageSize(event.api.paginationGetPageSize())
  //       );
  //       console.log({ gridApi });
  //       // gridApi.addEventListener("page", (event) =>
  //       //   setPageSize(event.api.paginationGetPageSize())
  //       // );
  //       // gridApi.setDatasource(serverSideDataSource);
  //     }
  //   }, [gridApi, pageSize]);

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [updateStatus]);

  useEffect(() => {
    setRowData(productsList);
  }, [productsList]);

  useEffect(() => {
    if (Object.keys(editProductData).length > 0) {
      dispatch(resetEditProduct());
    }
  }, [editProductData]);

  const ActionRenderer = ({ data }) => {
    return (
      <div className="d-flex justify-content-around">
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => {
            // dispatch(deleteProductAsync(data._id));
            navigate("/product-form", {
              state: { editId: data._id },
              replace: true,
            });
          }}
        >
          <i className="fa fa-edit"> </i>{" "}
        </span>
        <span
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => {
            dispatch(deleteProductAsync(data._id));
            navigate("/");
          }}
        >
          <i className="fa fa-trash"> </i>{" "}
        </span>
      </div>
    );
  };

  const columnDefs = [
    {
      field: "title",
      filter: "agTextColumnFilter",
    },
    {
      field: "description",
      filter: "agTextColumnFilter",
    },
    {
      field: "price",
      filter: "agNumberColumnFilter",
    },
    {
      field: "rating",
      filter: "agNumberColumnFilter",
    },
    {
      field: "stock",
      filter: "agNumberColumnFilter",
    },
    {
      field: "brand",
      filter: "agTextColumnFilter",
    },
    {
      field: "category",
      filter: "agTextColumnFilter",
    },
    {
      //   headerName: "",
      field: "action",
      cellRenderer: ActionRenderer,
      width: 80,
      editable: false,
      suppressMenu: true,
      suppressSorting: true,
      suppressFilter: true,
    },
  ];

  // const addEmptyRow = () => {
  //   setRowData([...rowData, {}]); // Add an empty object at the end
  // };

  const onCellValueChanged = (params) => {
    console.log({ params });

    const { data } = params.node;
    const { newValue } = params;

    const updatedRowData = rowData.map((row) => {
      return row === data ? { ...row, ...params.data } : row;
    });

    setRowData(updatedRowData);
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 110,
      editable: false,
    };
  }, []);

  const onPageChanged = (newPage) => {
    setCurrentPage(newPage);
  };

  const onGridReady = (params) => {
    // console.log("call", params.api.paginationGetRowCount());
    console.log("called");
    setGridApi(params.api);
    // params.api.paginationGetTotalPages();
    setGridColumnApi(params.columnApi);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
      {" "}
      <AgGridReact
        rowData={rowData}
        rowModelType="clientSide"
        columnDefs={columnDefs}
        // onCellValueChanged={onCellValueChanged}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20]}
        onPaginationChanged={(event) =>
          onPageChanged(event.api.paginationGetCurrentPage() + 1)
        }
        enableBrowserTooltips={true}
        suppressRowClickSelection={true}
        floatingFilter={true}
        onGridReady={onGridReady}
        onFilterChanged={() => {
          const filterModel = gridApi.getFilterModel();
          console.log({ filterModel });
        }}
        //
        suppressPaginationPanel={false}
        domLayout="autoHeight"
      />{" "}
    </div>
  );
};

export default Products;
