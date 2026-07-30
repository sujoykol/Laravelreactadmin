import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import {
    getPermissions,
    createPermission,
    updatePermission,
    deletePermission,
} from "../services/permissionService";
import toast from "react-hot-toast";


export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [permName, setPermName] = useState("");

   const fetchPermissions = async () => {
    setLoading(true);

    try {
        const data = await getPermissions();
        setPermissions(data);
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load permissions");
    } finally {
        setLoading(false);
    }
};

  useEffect(() => { fetchPermissions(); }, []);

  const openAdd = () => {
    setEditing(null);
    setPermName("");
    setShow(true);
  };

  const openEdit = (perm) => {
    setEditing(perm);
    setPermName(perm.name);
    setShow(true);
  };

  const savePermission = async () => {
    if (!permName.trim()) {
        toast.error("Permission name is required");
        return;
    }

    try {
        if (editing) {
            await updatePermission(editing.id, {
                name: permName,
            });

            toast.success("Permission updated successfully");
        } else {
            await createPermission({
                name: permName,
            });

            toast.success("Permission created successfully");
        }

        setShow(false);
        setEditing(null);
        setPermName("");

        fetchPermissions();

    } catch (err) {

        if (err.response?.data?.errors) {
            Object.values(err.response.data.errors).forEach(messages =>
                toast.error(messages[0])
            );
        } else {
            toast.error(err.response?.data?.message || "Save failed");
        }
    }
};

  const removePermission = async (id) => {
    if (!window.confirm("Are you sure you want to delete this permission?")) {
        return;
    }

    try {
        await deletePermission(id);

        toast.success("Permission deleted successfully");

        fetchPermissions();

    } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed");
    }
};

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Permissions</h3>
        <Button onClick={openAdd}>+ Add Permission</Button>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th width="220">Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td className="fw-semibold">{p.name}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => removePermission(p.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Permission" : "Add Permission"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3">
              <Form.Label>Permission Name</Form.Label>
              <Form.Control
                value={permName}
                onChange={(e) => setPermName(e.target.value)}
                placeholder="e.g. manage users"
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={savePermission}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
