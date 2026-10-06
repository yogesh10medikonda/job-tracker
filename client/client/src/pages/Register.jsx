import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Create account</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input name="name" placeholder="Name" value={form.name}
          onChange={onChange} required className="w-full border rounded px-3 py-2" />
        <input name="email" type="email" placeholder="Email" value={form.email}
          onChange={onChange} required className="w-full border rounded px-3 py-2" />
        <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password}
          onChange={onChange} required minLength={6} className="w-full border rounded px-3 py-2" />
        <button className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">
          Register
        </button>
        <p className="text-sm text-center">
          Have an account? <Link to="/login" className="text-blue-600">Log in</Link>
        </p>
      </form>
    </div>
  );
}