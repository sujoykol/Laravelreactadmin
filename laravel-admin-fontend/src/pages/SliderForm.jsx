import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getSlider,
    createSlider,
    updateSlider
} from "../services/sliderService";

import { getImageUrl } from "../utils/image";
import toast from "react-hot-toast";



export default function SliderForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [preview, setPreview] = useState(null);

  useEffect(() => {

    if (id) {

        const fetchSlider = async () => {

            try {

                const data = await getSlider(id);

                setForm({
                    title: data.title,
                    description: data.description,
                    image: null
                });

                setPreview(
                    getImageUrl(data.image)
                );

            } catch(error) {

                toast.error("Failed to load slider ❌");

            }

        };

        fetchSlider();
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

    formData.append(
        "title",
        form.title
    );

    formData.append(
        "description",
        form.description
    );


    if(form.image){

        formData.append(
            "image",
            form.image
        );

    }


    try {

        if(id){

            await updateSlider(
                id,
                formData
            );

            toast.success(
                "Slider updated ✅"
            );

        }
        else{

            await createSlider(
                formData
            );

            toast.success(
                "Slider created ✅"
            );

        }


        navigate("/sliders");


    } catch(error){

        if(error.response?.data?.errors){

            Object.values(
                error.response.data.errors
            )
            .flat()
            .forEach(msg =>
                toast.error(msg)
            );

        }
        else{

            toast.error(
                "Failed to save ❌"
            );

        }

    }
};
  return (
    <div className="container mt-4">
      <h2>{id ? "Edit Slider" : "Add Slider"}</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="form-control"  />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="form-control"></textarea>
        </div>

        <div className="mb-3">
          <label>Image</label>
          <input type="file" name="image" onChange={handleChange} className="form-control" />
          {preview && <img src={preview} alt="Preview" width="100" className="mt-2" />}
        </div>
        <button type="submit" className="btn btn-success">{id ? "Update" : "Create"}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/sliders")}>Cancel</button>
      </form>
    </div>
  );
}
