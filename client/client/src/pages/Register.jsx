
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. The server may be waking up, try again in a moment."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        {error && (
          <p className="text-red-600 text-sm text-center">
            {error}
          </p>
        )}

        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <button
          disabled={busy}
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? "Please wait..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}

