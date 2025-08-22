import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
       toast.success(`Welcome back`);
      navigate("/dashboard");
    } catch  {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="card shadow">
          <div className="card-body login-card-body">
            <h3 className="text-center mb-4">Admin Login</h3>

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                 <input type="email" className="form-control" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <i className="fas fa-envelope"></i>
                  </div>
                </div>
              </div>

              <div className="input-group mb-3">
               <input type="password" className="form-control" placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <i className="fas fa-lock"></i>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}


