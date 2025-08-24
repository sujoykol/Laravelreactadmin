import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function Sliders() {
  const [sliders, setSliders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSliders = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/sliders?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSliders(data.data);
      setPagination({
        current: data.current_page,
        total: data.last_page
      });
    } catch  {
      toast.error("Failed to fetch sliders ❌");
    }
    setLoading(false);
  };

  const deleteSlider = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/sliders/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Slider deleted ✅");
      fetchSliders(pagination.current);
    } catch {
      toast.error("Failed to delete ❌");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/sliders/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(data.message);
      fetchSliders(); // refresh list
    } catch  {
      toast.error("Failed to update status ❌");
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Sliders</h2>
        <Link to="/sliders/new" className="btn btn-primary">+ Add Slider</Link>
      </div>

      {loading ? <p>Loading...</p> : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Name</th><th>Description</th><th>Image</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.length > 0 ? sliders.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.title}</td>
                <td>{s.description}</td>
                <td>
                  {s.image ? (
                    <img src={`http://127.0.0.1:8000/storage/${s.image}`} alt="" width="50" />
                  ) : "No Image"}
                </td>
                  <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={s.status === 1}
                    onChange={() => toggleStatus(s.id)}
                  />
                </div>
              </td>
                <td>
                  <Link to={`/sliders/edit/${s.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                  <button onClick={() => deleteSlider(s.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            )) : <tr><td colSpan="6" className="text-center">No sliders found</td></tr>}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: pagination.total }, (_, i) => (
            <li key={i+1} className={`page-item ${pagination.current === i+1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => fetchSliders(i+1)}>{i+1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
