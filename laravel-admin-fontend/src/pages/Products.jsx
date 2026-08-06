import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    getProducts,
    deleteProduct,
    toggleProductStatus,
} from "../services/productService";
import { getImageUrl } from "../utils/image"

export default function Products() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchProducts = async (page = 1) => {
        setLoading(true);

        try {
            const data = await getProducts(page);

            setProducts(data.data);

            setPagination({
                current: data.current_page,
                total: data.last_page,
            });
        } catch (error) {
            toast.error("Failed to fetch products ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
        await deleteProduct(id);
        toast.success("Product deleted ✅");
        fetchProducts(pagination.current);
    } catch (err) {
        console.log(err.response);
        toast.error("Failed to delete ❌");
    }
};

    const toggleStatus = async (id) => {
        try {
            const data = await toggleProductStatus(id);

            toast.success(data.message);

            fetchProducts(pagination.current);
        } catch (error) {
            toast.error("Failed to update status ❌");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Products</h2>
        <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      {loading ? <p>Loading...</p> : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Name</th><th>Price</th><th>Description</th><th>Image</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.description}</td>
                <td>
                  {p.image ? (
                    
                    <img src={getImageUrl(p.image)} alt="" width="50"/>
                  ) : "No Image"}
                </td>
                 <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={p.status === 1}
                    onChange={() => toggleStatus(p.id)}
                  />
                </div>
              </td>
                <td>
                  <Link to={`/products/edit/${p.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            )) : <tr><td colSpan="7" className="text-center">No products found</td></tr>}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: pagination.total }, (_, i) => (
            <li key={i+1} className={`page-item ${pagination.current === i+1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => fetchProducts(i+1)}>{i+1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
