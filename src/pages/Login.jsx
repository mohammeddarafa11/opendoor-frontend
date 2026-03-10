import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || "/units";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const userData = await login(
        formData.email.trim().toLowerCase(),
        formData.password,
      );
      toast.success(`Welcome back, ${userData.name}!`);
      switch (userData.role) {
        case "manager":
        case "admin":
          navigate("/manager", { replace: true });
          break;
        case "agent":
          navigate("/agent", { replace: true });
          break;
        default:
          navigate(from, { replace: true });
      }
    } catch (error) {
      const msg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Login failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Sticky sub-header (below fixed Navbar which is 64px) */}
      <div className="auth-topbar">
        <button className="auth-back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="auth-topbar-title">Log in or sign up</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-h1">Welcome back</h1>
          <p className="auth-sub">Enter your details to continue</p>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">continue with email</span>
            <div className="auth-divider-line" />
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            {/* Email */}
            <FloatField
              icon={<Mail size={16} />}
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              focused={focused}
              setFocused={setFocused}
              autoComplete="email"
            />

            {/* Password */}
            <FloatField
              icon={<Lock size={16} />}
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              focused={focused}
              setFocused={setFocused}
              autoComplete="current-password"
              showToggle
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <>
                  <Loader2 size={18} className="auth-spin" /> Logging in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="auth-switch">
            <span>Don't have an account?</span>
            <Link to="/register" className="auth-switch-link">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <style>{authStyles}</style>
    </div>
  );
}

/* ── Reusable floating-label field ── */
function FloatField({
  icon,
  label,
  name,
  type,
  value,
  onChange,
  focused,
  setFocused,
  autoComplete,
  showToggle,
  showPassword,
  onToggle,
}) {
  const isActive = value || focused === name;
  const inputType = showToggle ? (showPassword ? "text" : "password") : type;
  return (
    <div className="float-wrap">
      <span className="float-icon">{icon}</span>
      <input
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={autoComplete}
        onFocus={() => setFocused(name)}
        onBlur={() => setFocused("")}
        className={`float-input ${focused === name ? "float-input--focused" : ""}`}
        style={{ paddingRight: showToggle ? 44 : 14 }}
      />
      <label className={`float-label ${isActive ? "float-label--active" : ""}`}>
        {label}
      </label>
      {showToggle && (
        <button type="button" onClick={onToggle} className="float-eye">
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
    </div>
  );
}

/* ── Shared auth CSS injected once ── */
export const authStyles = `
  /* Page */
  .login-page, .register-page {
    min-height: 100vh;
    background: #f7f7f7;
    font-family: var(--fontFamilyNormal);
    padding-top: 64px;
  }

  /* Sub-header */
  .auth-topbar {
    position: sticky;
    top: 64px;
    z-index: 40;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 52px;
  }
  .auth-back-btn {
    width: 36px; height: 36px; border-radius: 50%;
    border: none; background: transparent; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #222;
  }
  .auth-topbar-title {
    font-family: var(--fontFamilyNormal);
    font-size: 15px; font-weight: 700; color: #222;
  }

  /* Container */
  .auth-container {
    max-width: 480px;
    margin: 0 auto;
    padding: 28px 16px 64px;
  }

  /* Card */
  .auth-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #ebebeb;
    padding: 28px 24px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  }

  /* Typography */
  .auth-h1 {
    font-family: var(--fontFamilyHeading);
    font-size: 26px; font-weight: 600;
    color: var(--pcolor2); margin: 0 0 6px;
    letter-spacing: -0.02em;
  }
  .auth-sub {
    font-size: 14px; color: #717171;
    font-family: var(--fontFamilyNormal); margin: 0 0 24px;
  }

  /* Divider */
  .auth-divider {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px;
  }
  .auth-divider-line { flex: 1; height: 1px; background: #ebebeb; }
  .auth-divider-text {
    font-size: 11px; color: #b0b0b0;
    letter-spacing: 0.1em; text-transform: uppercase;
    white-space: nowrap; font-family: var(--fontFamilyNormal);
  }

  /* Form */
  .auth-form { display: flex; flex-direction: column; gap: 14px; }

  /* Floating field */
  .float-wrap { position: relative; display: flex; align-items: center; }
  .float-icon {
    position: absolute; left: 14px; color: #aaa;
    pointer-events: none; z-index: 2; display: flex;
  }
  .float-input {
    width: 100%;
    padding: 22px 14px 8px 42px;
    border: 1.5px solid #ddd;
    border-radius: 12px;
    font-size: 15px;
    font-family: var(--fontFamilyNormal);
    color: var(--pcolor2);
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
  }
  .float-input--focused {
    border-color: var(--pcolor2) !important;
    box-shadow: 0 0 0 2.5px rgba(205,54,45,0.1);
    background: #fff;
  }
  .float-input.has-error { border-color: var(--pcolor1) !important; }
  .float-label {
    position: absolute; left: 42px; top: 50%;
    transform: translateY(-50%);
    font-size: 15px; color: #aaa;
    font-family: var(--fontFamilyNormal);
    pointer-events: none;
    transition: all 0.15s; z-index: 2;
  }
  .float-label--active {
    top: 34%; transform: translateY(-100%);
    font-size: 11px; color: #717171; letter-spacing: 0.04em;
  }
  .float-eye {
    position: absolute; right: 14px;
    background: none; border: none; cursor: pointer;
    display: flex; align-items: center; padding: 0;
    color: #717171; z-index: 2;
  }

  /* Error / hint text */
  .field-error { font-size: 12px; color: var(--pcolor1); margin: -6px 0 0 4px; font-family: var(--fontFamilyNormal); }
  .field-hint  { font-size: 11px; color: #b0b0b0;        margin: -6px 0 0 4px; font-family: var(--fontFamilyNormal); }

  /* Submit button */
  .auth-submit {
    margin-top: 6px; width: 100%;
    padding: 15px;
    background: var(--pcolor1); color: #fff;
    border: none; border-radius: 12px;
    font-size: 15px; font-weight: 700;
    font-family: var(--fontFamilyNormal);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s;
    -webkit-appearance: none;
  }
  .auth-submit:hover:not(:disabled) { background: var(--pcolor3); }
  .auth-submit:disabled { opacity: 0.7; cursor: not-allowed; }

  /* Spin */
  @keyframes auth-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .auth-spin { animation: auth-spin 1s linear infinite; }

  /* Switch row */
  .auth-switch {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; margin-top: 20px;
    font-size: 14px; color: #484848;
    font-family: var(--fontFamilyNormal);
    flex-wrap: wrap; text-align: center;
  }
  .auth-switch-link {
    font-size: 14px; font-weight: 700;
    color: var(--pcolor1);
    text-decoration: underline;
    font-family: var(--fontFamilyNormal);
  }

  /* Terms */
  .auth-terms {
    font-size: 12px; color: #717171; line-height: 1.6;
    margin-top: 16px; text-align: center;
    font-family: var(--fontFamilyNormal);
  }
  .auth-terms a { color: var(--pcolor2); text-decoration: underline; }

  /* ─── Responsive ─── */
  @media (min-width: 600px) {
    .auth-container { padding: 40px 24px 80px; }
    .auth-card { padding: 36px 32px; }
    .auth-h1 { font-size: 30px; }
  }
`;
