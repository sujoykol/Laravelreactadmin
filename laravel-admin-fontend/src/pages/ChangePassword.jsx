import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ChangePasswordForm = () => {
  const { changePassword } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(oldPassword ==="" || newPassword ==="" || confirmPassword ===""){
      toast.error("All fields are required");
    }else {
    const success = await changePassword(oldPassword, newPassword, confirmPassword);
    if (success) {
      navigate("/dashboard"); // ✅ redirect on success
    } 
  }
  };

  return (
   <div className="d-flex justify-content-center align-items-center min-vh-10 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
        {/* Header */}
        <h3 className="text-center mb-3">Change Password</h3>
        <p className="text-muted text-center mb-4">
          Keep your account secure by updating your password regularly.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="mb-3">
            <label className="form-label">Old Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              
            />
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              
            />
          </div>

          {/* Submit */}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
