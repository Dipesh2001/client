import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Products from "./components/pages/Products";
import Layout from "./components/UI/Layout";
import ProductForm from "./components/pages/ProductForm";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="/" index element={<Products />} />
            <Route path="/product-form" element={<ProductForm />} />
          </Route>
        </Routes>{" "}
      </Router>{" "}
    </div>
  );
};

export default App;
