import { useFormik } from "formik";
import React, { useEffect } from "react";
import { productSchema } from "../../app/schema";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductAsync,
  getProductAsync,
  resetEditProduct,
  updateProductAsync,
} from "../../features/productsSlice";

const ProductForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useLocation();
  let editId = state?.state?.editId;

  const editProductData = useSelector(
    (state) => state.products.editProductData
  );

  const {
    values,
    touched,
    setValues,
    errors,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues: {
      title: "",
      rating: "",
      description: "",
      stock: "",
      brand: "",
      category: "",
      price: "",
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      editId
        ? dispatch(updateProductAsync({ editId, values }))
        : dispatch(addProductAsync(values));
      navigate("/");
    },
  });

  useEffect(() => {
    // console.log(state);
    // let editId = state?.state?.editId;
    if (editId) {
      // console.log(state?.editId);
      dispatch(getProductAsync(editId));
    }
  }, [editId]);

  useEffect(() => {
    if (Object.keys(editProductData).length > 0) {
      setValues({
        title: editProductData.title,
        rating: editProductData.rating,
        description: editProductData.description,
        stock: editProductData.stock,
        brand: editProductData.brand,
        category: editProductData.category,
        price: editProductData.price,
      });
    }
  }, [editProductData]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <legend>Product form</legend>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="Enter product title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="text-danger">
            {" "}
            {touched.title && errors.title ? <div>{errors.title}</div> : null}
          </span>
        </div>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <select
            id="rating"
            className="form-select"
            value={values.rating}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select Rating</option>
            {[5, 4, 3, 2, 1].map((ele, ind) => {
              return (
                <option key={ind} value={ele}>
                  {ele}
                </option>
              );
            })}
          </select>
          <span className="text-danger">
            {" "}
            {touched.rating && errors.rating ? (
              <div>{errors.rating}</div>
            ) : null}
          </span>
        </div>
        <div className="mb-3">
          <label id="description" className="form-label">
            description
          </label>
          <textarea
            className="form-control"
            id="description"
            placeholder="Enter product description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
          ></textarea>
          <span className="text-danger">
            {" "}
            {touched.description && errors.description ? (
              <div>{errors.description}</div>
            ) : null}
          </span>
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            className="form-control"
            placeholder="Enter stock"
            min={1}
            value={values.stock}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="text-danger">
            {" "}
            {touched.stock && errors.stock ? <div>{errors.stock}</div> : null}
          </span>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="form-control"
            placeholder="Enter product price"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="text-danger">
            {" "}
            {touched.price && errors.price ? <div>{errors.price}</div> : null}
          </span>
        </div>
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            className="form-control"
            placeholder="Enter brand"
            value={values.brand}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="text-danger">
            {" "}
            {touched.brand && errors.brand ? <div>{errors.brand}</div> : null}
          </span>
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            className="form-select"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select Category</option>
            {[
              "groceries",
              "skincare",
              "fragrances",
              "laptops",
              "smartphones",
            ].map((ele, ind) => {
              return (
                <option key={ind} value={ele}>
                  {ele}
                </option>
              );
            })}
          </select>
          <span className="text-danger">
            {" "}
            {touched.category && errors.category ? (
              <div>{errors.category}</div>
            ) : null}
          </span>
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
