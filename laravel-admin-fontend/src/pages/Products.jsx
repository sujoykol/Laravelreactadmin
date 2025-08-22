import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProducts(data.data);
      setPagination({
        current: data.current_page,
        total: data.last_page
      });
    } catch  {
      toast.error("Failed to fetch products ❌");
    }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Product deleted ✅");
      fetchProducts(pagination.current);
    } catch {
      toast.error("Failed to delete ❌");
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
              <th>ID</th><th>Name</th><th>Price</th><th>Description</th><th>Image</th><th>Actions</th>
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
                    <img src={`http://127.0.0.1:8000/storage/${p.image}`} alt="" width="50" />
                  ) : "No Image"}
                </td>
                <td>
                  <Link to={`/products/edit/${p.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                  <button onClick={() => deleteProduct(p.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="text-center">No products found</td></tr>}
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
