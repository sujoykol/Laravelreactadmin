import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getRoles,
    assignRole,
} from "../services/userService";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const token = localStorage.getItem("token");
  const [show, setShow] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });

  // Fetch users
  const fetchUsers = async () => {
    try {
        const data = await getUsers();
        setUsers(data);
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch users");
    }
};

  // Fetch roles
   const fetchRoles = async () => {
    try {
        const data = await getRoles();
        setRoles(data);
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch roles");
    }
};

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Open modal
  const handleShow = (user = null) => {
    setEditUser(user);
    setForm(
      user
        ? { name: user.name, email: user.email, password: "", role: user.roles?.[0]?.name || "" }
        : { name: "", email: "", password: "", role: "" }
    );
    setShow(true);
  };

  const handleClose = () => setShow(false);

  // Save user
   const handleSave = async () => {
    try {
        let user;

        if (editUser) {
            await updateUser(editUser.id, form);

            if (form.role) {
                await assignRole(editUser.id, form.role);
            }

            toast.success("User updated successfully");
        } else {
            user = await createUser(form);

            if (form.role) {
                await assignRole(user.id, form.role);
            }

            toast.success("User created successfully");
        }

        handleClose();
        fetchUsers();

    } catch (err) {

        if (err.response?.data?.errors) {
            Object.values(err.response.data.errors).forEach(messages =>
                toast.error(messages[0])
            );
        } else {
            toast.error(err.response?.data?.message || "Failed to save user");
        }
    }
};

  // Delete user
   const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this user?")) {
        return;
    }

    try {

        await deleteUser(id);

        toast.success("User deleted successfully");

        fetchUsers();

    } catch (err) {

        toast.error(err.response?.data?.message || "Failed to delete user");

    }
};

  return (
    <div className="container mt-4">
      <h3>User Management</h3>
      <Button variant="primary" onClick={() => handleShow()}>
        + Add User
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id}>
              <td>{i + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.roles?.map((r) => r.name).join(", ")}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleShow(u)}>
                  Edit
                </Button>{" "}
                <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="">-- Select Role --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>

            {!editUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </Form.Group>
            )}

            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
