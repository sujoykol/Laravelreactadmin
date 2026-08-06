import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Modal, Form, Image } from "react-bootstrap";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,
} from "../services/customerService";
import { getImageUrl } from "../utils/image";
const Customer = () => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    status: 1, // default active
  });

  // Fetch customers
const fetchCustomers = async () => {
    try {
        const data = await getCustomers();
        setCustomers(data.data || data);
    } catch {
        toast.error("Failed to fetch customers ❌");
    }
};

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Open modal for add
  const handleAdd = () => {
    setEditId(null);
    setFormData({ name: "", email: "", phone: "", image: null, status: 1 });
    setShow(true);
  };

  // Open modal for edit
  const handleEdit = (customer) => {
    setEditId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      image: null,
      status: customer.status,
    });
    setShow(true);
  };

  // Delete customer
 const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete?")) {
        return;
    }

    try {

        await deleteCustomer(id);

        toast.success("Customer deleted ✅");

        fetchCustomers();

    } catch {

        toast.error("Delete failed ❌");

    }

};

  // Submit form
 const handleSubmit = async (e) => {

    e.preventDefault();

    const form = new FormData();

    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("status", formData.status);

    if (formData.image) {
        form.append("image", formData.image);
    }

    try {

        if (editId) {

            await updateCustomer(editId, form);

            toast.success("Customer updated ✅");

        } else {

            await createCustomer(form);

            toast.success("Customer added ✅");

        }

        setShow(false);

        fetchCustomers();

    } catch (err) {

        if (err.response?.data?.errors) {

            Object.values(err.response.data.errors)
                .flat()
                .forEach((message) => toast.error(message));

        } else {

            toast.error(
                err.response?.data?.message || "Save failed ❌"
            );

        }

    }

};
  // Toggle status
    const handleToggleStatus = async (id) => {

    try {

        const data = await toggleCustomerStatus(id);

        toast.success(data.message);

        fetchCustomers();

    } catch {

        toast.error("Failed to update status ❌");

    }

};


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Customers</h3>
        <Button onClick={handleAdd}>+ Add Customer</Button>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>
                  {c.image && (
                     <img src={getImageUrl(c.image)} alt="" width="50"/>
                  
                  )}
                </td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>

                  <Form.Check
                    type="switch"
                    id={`status-${c.id}`}
                    checked={c.status}
                    onChange={() => handleToggleStatus(c.id)}
                   />
                 
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Customer" : "Add Customer"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Active"
                checked={formData.status === 1}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked ? 1 : 0 })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editId ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Customer;
