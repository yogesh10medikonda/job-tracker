import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Log in</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input name="email" type="email" placeholder="Email" value={form.email}
          onChange={onChange} required className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" placeholder="Password" value={form.password}
          onChange={onChange} required className="w-full border rounded px-3 py-2" />
        <button className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">
          Log in
        </button>
        <p className="text-sm text-center">
          No account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
}