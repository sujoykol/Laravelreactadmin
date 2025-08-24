
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import Sliders from "./pages/Sliders";
import SliderForm from "./pages/SliderForm";
import Products from "./pages/Products";
import Category from "./pages/Category";
import Customer from "./pages/Customers";
import ProductForm from "./pages/ProductForm";
import Users from "./pages/Users";
import Role from "./pages/Roles";
import Permissions from "./pages/Permissions";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./component/Layout";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Protected Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/sliders/new" element={<SliderForm />} />
            <Route path="/sliders/edit/:id" element={<SliderForm />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Role />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/sliders" element={<Sliders />} />
            <Route path="/customers" element={<Customer />} />  
            <Route path="/categories" element={<Category />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
          </Route>
        </Routes>
      </Router>
     <Toaster position="top-right" />
  </AuthProvider>
  );
}

export default App;
