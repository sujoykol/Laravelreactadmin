import { useEffect, useState, useContext } from "react";
import {
 getCategories,
 createCategory,
 updateCategory,
 deleteCategory,
 toggleCategoryStatus
} from "../services/categoryService";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [name, setName] = useState("");
    const [status, setStatus] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

  

    // Fetch categories
    const fetchCategories = async (pageNum = 1) => {
        try {
            const data = await getCategories(pageNum);
            setCategories(data.data);
            setPage(data.current_page);
            setLastPage(data.last_page);
        } catch  {
            toast.error("Failed to load categories ❌");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Open modal for Add/Edit
    const handleShowModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setStatus(category.status);
        } else {
            setEditingCategory(null);
            setName("");
            setStatus(true);
        }
        setShowModal(true);
    };

    // Save category
    const handleSave = async () => {
        try {
            if (editingCategory) {
                // Update
                await updateCategory(
                    editingCategory.id,
                    {
                        name,
                        status
                    }
                );
                toast.success("Category updated ✅");
            } else {
                // Create
                  await createCategory(
                    {
                        name,
                        status
                    }
                );

                toast.success("Category added ✅");
            }
            setShowModal(false);
            fetchCategories(page);
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed ❌");
        }
    };

    // Delete category
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteCategory(id);
            toast.success("Category deleted 🗑️");
            fetchCategories(page);
        } catch  {
            toast.error("Delete failed ❌");
        }
    };

    // Toggle status
    const toggleStatus = async (id) => {
        try {
            await toggleCategoryStatus(id);
            toast.success("Status updated 🔄");
            fetchCategories(page);
        } catch  {
            toast.error("Failed to toggle status ❌");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Categories</h2>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    + Add Category
                </Button>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th width="20%">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.id}</td>
                                <td>{cat.name}</td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        id={`status-${cat.id}`}
                                        checked={cat.status}
                                        onChange={() => toggleStatus(cat.id)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => handleShowModal(cat)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" className="text-center">No categories found</td></tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-between">
                <Button disabled={page === 1} onClick={() => fetchCategories(page - 1)}>Previous</Button>
                <span>Page {page} of {lastPage}</span>
                <Button disabled={page === lastPage} onClick={() => fetchCategories(page + 1)}>Next</Button>
            </div>

            {/* Modal for Add/Edit */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCategory ? "Edit Category" : "Add Category"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Check
                                type="switch"
                                label="Active"
                                checked={status}
                                onChange={(e) => setStatus(e.target.checked)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;
