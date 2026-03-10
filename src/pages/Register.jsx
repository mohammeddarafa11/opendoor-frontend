import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { authStyles } from "./Login"; // reuse shared CSS

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    else if (formData.name.trim().length < 2) e.name = "At least 2 characters";
    if (!formData.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Invalid email";
    const cleanPhone = formData.phone.replace(/\s/g, "").replace(/^\+20/, "");
    if (!formData.phone) e.phone = "Phone is required";
    else if (!/^01[0125]\d{8}$/.test(cleanPhone))
      e.phone = "Invalid Egyptian number";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "Min 6 characters";
    if (!formData.confirmPassword) e.confirmPassword = "Please confirm";
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        password: formData.password,
      });
      toast.success("Registration successful! Welcome aboard!");
      navigate("/units", { replace: true });
    } catch (error) {
      const msg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "name",
      label: "Full name",
      type: "text",
      icon: <User size={16} />,
      hint: null,
      autoComplete: "name",
    },
    {
      key: "email",
      label: "Email address",
      type: "email",
      icon: <Mail size={16} />,
      hint: null,
      autoComplete: "email",
    },
    {
      key: "phone",
      label: "Phone number",
      type: "tel",
      icon: <Phone size={16} />,
      hint: "Egyptian number: 01xxxxxxxxx",
      autoComplete: "tel",
    },
  ];

  const pwFields = [
    {
      key: "password",
      label: "Password",
      show: showPassword,
      toggle: () => setShowPassword(!showPassword),
      hint: "Min 6 characters",
    },
    {
      key: "confirmPassword",
      label: "Confirm password",
      show: showConfirmPassword,
      toggle: () => setShowConfirmPassword(!showConfirmPassword),
      hint: null,
    },
  ];

  return (
    <div className="register-page">
      <div className="auth-topbar">
        <button className="auth-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="auth-topbar-title">Create account</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-h1">Join K-Developments</h1>
          <p className="auth-sub">It's free and takes less than a minute</p>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">fill in your details</span>
            <div className="auth-divider-line" />
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            {/* Text / email / phone */}
            {fields.map(({ key, label, type, icon, hint, autoComplete }) => (
              <div
                key={key}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <div className="float-wrap">
                  <span className="float-icon">{icon}</span>
                  <input
                    type={type}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    placeholder=" "
                    autoComplete={autoComplete}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused("")}
                    className={`float-input ${focused === key ? "float-input--focused" : ""} ${errors[key] ? "has-error" : ""}`}
                  />
                  <label
                    className={`float-label ${formData[key] || focused === key ? "float-label--active" : ""}`}
                  >
                    {label}
                  </label>
                </div>
                {errors[key] && <p className="field-error">{errors[key]}</p>}
                {hint && !errors[key] && <p className="field-hint">{hint}</p>}
              </div>
            ))}

            {/* Password fields */}
            {pwFields.map(({ key, label, show, toggle, hint }) => (
              <div
                key={key}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <div className="float-wrap">
                  <span className="float-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    type={show ? "text" : "password"}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    placeholder=" "
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused("")}
                    className={`float-input ${focused === key ? "float-input--focused" : ""} ${errors[key] ? "has-error" : ""}`}
                    style={{ paddingRight: 44 }}
                  />
                  <label
                    className={`float-label ${formData[key] || focused === key ? "float-label--active" : ""}`}
                  >
                    {label}
                  </label>
                  <button type="button" onClick={toggle} className="float-eye">
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors[key] && <p className="field-error">{errors[key]}</p>}
                {hint && !errors[key] && <p className="field-hint">{hint}</p>}
              </div>
            ))}

            <p className="auth-terms">
              By creating an account, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <>
                  <Loader2 size={18} className="auth-spin" /> Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-switch-link">
              Log in
            </Link>
          </div>
        </div>
      </div>

      <style>{authStyles}</style>
    </div>
  );
}
