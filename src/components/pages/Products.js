import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import { useEffect, useMemo, useState } from "react";
import {
  addProductAsync,
  deleteProductAsync,
  fetchProductsAsync,
  resetEditProduct,
  updateProductAsync,
} from "../../features/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { productSchema } from "../../app/schema";

const Products = () => {
  const [rowData, setRowData] = useState([]);
  const [inputRow, setInputRow] = useState({
    title: "",
    rating: "",
    description: "",
    stock: "",
    brand: "",
    category: "",
    price: "",
  });
  // const [pinnedTopRowData, setPinnedTopRowData] = useState([
  //   {
  //     title: "",
  //     rating: "",
  //     description: "",
  //     stock: "",
  //     brand: "",
  //     category: "",
  //     price: "",
  //   },
  // ]);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const {
    values,
    touched,
    setValues,
    errors,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues: inputRow,
    validationSchema: productSchema,
    onSubmit: (values) => {
      // editId
      //   ? dispatch(updateProductAsync({ editId, values }))
      //   : dispatch(addProductAsync(values));
      // navigate("/");
    },
  });
  //

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, []);
  const { productsList, editProductData } = useSelector(
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

  // useEffect(() => {
  //   console.log("setting again");
  //   setRowData(productsList);
  // }, [productsList]);

  const transformedData = useMemo(() => {
    return productsList.map((product) => ({
      title: product.title,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand,
      category: product.category,
      id: product._id,
      // Add more fields or modify existing fields as needed
    }));
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

  function hasEmptyValue(obj) {
    for (const value of Object.values(obj)) {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        Number.isNaN(value)
      ) {
        return true;
      }
    }
    return false;
  }

  const handleCustomSubmit = () => {
    if (!hasEmptyValue(inputRow)) {
      dispatch(addProductAsync(inputRow));
    }
  };

  const placeholderRenderer = ({ value, colDef, node }) => {
    return value && node.rowPinned !== "top" ? (
      value
    ) : (
      <div>
        <input
          type="text"
          placeholder={
            colDef.field[0].toUpperCase() + colDef.field.slice(1) + "..."
          }
          defaultValue={inputRow[colDef.field]}
          id={colDef.field}
          name={colDef.field}
          onBlur={(e) => {
            setInputRow({ ...inputRow, [colDef.field]: e.target.value });
          }}
        />
        <span className="text-danger">
          {touched.title && errors.title ? <div>{errors.title}</div> : null}
        </span>
      </div>
    );
  };

  // const placeholderRenderer = useMemo(() => {
  //   console.log("rendered");
  //   return ({ value, colDef, node }) => {
  //     return value && node.rowPinned !== "top" ? (
  //       value
  //     ) : (
  //       <div>
  //         <input
  //           type="text"
  //           placeholder={
  //             colDef.field[0].toUpperCase() + colDef.field.slice(1) + "..."
  //           }
  //           value={values[colDef.field]}
  //           onChange={(e) => {
  //             handleChange(e);
  //             inputRef.current = e.target;
  //           }}
  //           id={colDef.field}
  //           name={colDef.field}
  //         />
  //         <span className="text-danger">
  //           {touched.title && errors.title ? <div>{errors.title}</div> : null}
  //         </span>
  //       </div>
  //     );
  //   };
  // }, [values, touched, errors, handleChange]);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [inputRef.current]);

  const columnDefs = [
    {
      field: "title",
      filter: "agTextColumnFilter",
      cellRenderer: placeholderRenderer,
    },
    {
      field: "description",
      filter: "agTextColumnFilter",
      cellRenderer: placeholderRenderer,
    },
    {
      field: "price",
      filter: "agNumberColumnFilter",
      cellRenderer: placeholderRenderer,
    },
    {
      field: "rating",
      filter: "agNumberColumnFilter",
      cellRenderer: placeholderRenderer,
    },
    {
      field: "stock",
      filter: "agNumberColumnFilter",
      cellRenderer: placeholderRenderer,
    },
    {
      field: "brand",
      filter: "agTextColumnFilter",
      cellRenderer: placeholderRenderer,
    },
    {
      field: "category",
      filter: "agTextColumnFilter",
      cellRenderer: placeholderRenderer,
    },
    {
      field: "action",
      cellRenderer: ActionRenderer,
      width: 80,
      editable: false,
      suppressMenu: true,
      suppressSorting: true,
      suppressFilter: true,
    },
  ];

  const onCellValueChanged = (params) => {
    const { data } = params.node;
    // const { newValue } = params;
    let editId = data.id;
    delete data.id;

    params.node.rowPinned !== "top" &&
      dispatch(updateProductAsync({ editId, values: data }));
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 110,
      editable: ({ node }) => {
        return node.rowPinned !== "top" ? true : false;
      },
    };
  }, []);

  const onPageChanged = (newPage) => {
    setCurrentPage(newPage);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
      <AgGridReact
        rowData={transformedData}
        rowModelType="clientSide"
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20]}
        onPaginationChanged={(event) =>
          onPageChanged(event.api.paginationGetCurrentPage() + 1)
        }
        pinnedTopRowData={[inputRow]}
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
