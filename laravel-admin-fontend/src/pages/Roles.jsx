import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Badge, Spinner } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://127.0.0.1:8000/api";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // add/edit role
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");

  // manage role permissions
  const [showPermModal, setShowPermModal] = useState(false);
  const [roleForPerms, setRoleForPerms] = useState(null);
  const [selectedPerms, setSelectedPerms] = useState(new Set());
  const [savingPerms, setSavingPerms] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rRes, pRes] = await Promise.all([
        axios.get(`${API}/roles`, { headers: authHeader() }),
        axios.get(`${API}/permissions`, { headers: authHeader() }),
      ]);
      setRoles(rRes.data || []);
      setPermissions(pRes.data || []);
    } catch {
      toast.error("Failed to load roles/permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAddRole = () => {
    setEditingRole(null);
    setRoleName("");
    setShowRoleModal(true);
  };

  const openEditRole = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setShowRoleModal(true);
  };

  const saveRole = async () => {
    try {
      if (!roleName.trim()) return toast.error("Role name is required");
      if (editingRole) {
        await axios.put(`${API}/roles/${editingRole.id}`, { name: roleName }, { headers: authHeader() });
        toast.success("Role updated");
      } else {
        await axios.post(`${API}/roles`, { name: roleName }, { headers: authHeader() });
        toast.success("Role created");
      }
      setShowRoleModal(false);
      fetchAll();
    } catch {
      toast.error("Save failed");
    }
  };

  const removeRole = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    try {
      await axios.delete(`${API}/roles/${id}`, { headers: authHeader() });
      toast.success("Role deleted");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  const openManagePerms = (role) => {
    setRoleForPerms(role);
    const current = new Set((role.permissions || []).map((p) => p.name));
    setSelectedPerms(current);
    setShowPermModal(true);
  };

  const togglePermInSet = (permName) => {
    const copy = new Set(selectedPerms);
    if (copy.has(permName)) copy.delete(permName);
    else copy.add(permName);
    setSelectedPerms(copy);
  };

  const saveRolePermissions = async () => {
    if (!roleForPerms) return;
    setSavingPerms(true);
    try {
      const current = new Set((roleForPerms.permissions || []).map((p) => p.name));
      // find differences
      const toGive = [...selectedPerms].filter((p) => !current.has(p));
      const toRevoke = [...current].filter((p) => !selectedPerms.has(p));

      // perform API calls
      await Promise.all([
        ...toGive.map((p) =>
          axios.post(
            `${API}/roles/${roleForPerms.id}/give-permission`,
            { permission: p },
            { headers: authHeader() }
          )
        ),
        ...toRevoke.map((p) =>
          axios.post(
            `${API}/roles/${roleForPerms.id}/revoke-permission`,
            { permission: p },
            { headers: authHeader() }
          )
        ),
      ]);

      toast.success("Permissions updated");
      setShowPermModal(false);
      fetchAll();
    } catch {
      toast.error("Failed to update permissions");
    } finally {
      setSavingPerms(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Roles</h3>
        <Button onClick={openAddRole}>+ Add Role</Button>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Permissions</th>
              <th width="240">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r, idx) => (
              <tr key={r.id}>
                <td>{idx + 1}</td>
                <td className="fw-semibold">{r.name}</td>
                <td>
                  {(r.permissions || []).length ? (
                    r.permissions.map((p) => (
                      <Badge bg="secondary" className="me-1 mb-1" key={p.id}>
                        {p.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">No permissions</span>
                  )}
                </td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openManagePerms(r)}>
                    Manage Permissions
                  </Button>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => openEditRole(r)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => removeRole(r.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add/Edit Role Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRole ? "Edit Role" : "Add Role"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Admin"
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveRole}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Manage Permissions Modal */}
      <Modal show={showPermModal} onHide={() => setShowPermModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Permissions for: {roleForPerms?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {permissions.map((perm) => (
              <div className="col-md-4 mb-2" key={perm.id}>
                <Form.Check
                  type="checkbox"
                  label={perm.name}
                  checked={selectedPerms.has(perm.name)}
                  onChange={() => togglePermInSet(perm.name)}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPermModal(false)}>Close</Button>
          <Button variant="success" onClick={saveRolePermissions} disabled={savingPerms}>
            {savingPerms ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
