import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/image";

import { useNavigate, useParams } from "react-router-dom";
import {
    getProduct,
    createProduct,
    updateProduct,
} from "../services/productService";
import toast from "react-hot-toast";



export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "", price: "", image: null });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
        if (!id) return;

        try {
            const data = await getProduct(id);

            setForm({
                ...data,
                image: null,
            });
            setPreview(getImageUrl(data.image));
        } catch (error) {
            toast.error("Failed to load product ❌");
        }
    };

    loadProduct();
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
          await updateProduct(id, formData);
          toast.success("Product updated ✅");
      } else {
          await createProduct(formData);
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
