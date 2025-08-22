import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "", price: "", image: null });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(res => {
        setForm({ ...res.data, image: null });
        setPreview(res.data.image ? `http://127.0.0.1:8000/storage/${res.data.image}` : null);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (form.image) formData.append("image", form.image);

    try {
      if (id) {
        await axios.post(`${API_BASE_URL}/products/${id}?_method=PUT`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("Product updated ✅");
      } else {
        await axios.post(`${API_BASE_URL}/products`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("Product created ✅");
      }
      navigate("/products");
    } catch (err){
      
            if (err.response && err.response.data && err.response.data.errors) {
                Object.values(err.response.data.errors).forEach(msg => toast.error(msg));
            } else {
                toast.error("Failed to save ❌");
            }
      
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control"  />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-control"></textarea>
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="form-control"  />
        </div>
        <div className="mb-3">
          <label>Image</label>
          <input type="file" name="image" onChange={handleChange} className="form-control" />
          {preview && <img src={preview} alt="Preview" width="100" className="mt-2" />}
        </div>
        <button type="submit" className="btn btn-success">{id ? "Update" : "Create"}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/products")}>Cancel</button>
      </form>
    </div>
  );
}
