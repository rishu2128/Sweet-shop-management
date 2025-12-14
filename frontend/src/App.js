import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import SweetCard from "./components/SweetCard";


function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");


  const [newSweet, setNewSweet] = useState({ name: "", category: "", price: "", quantity: "" });

  useEffect(() => {
    if (token) {
      fetchSweets();
    }
  }, [token]);

  const fetchSweets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sweets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setSweets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setToken(data.token);
        setRole(data.role);
        navigate("/");
      } else {
        setMsg(data.message || "Login failed");
      }
    } catch (err) {
      setMsg("Server error");
    }
  };

  const handleRegister = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {

        setMsg("Registration successful! Please login.");
        navigate("/login");
      } else {
        setMsg(data.message || "Registration failed");
      }
    } catch (err) {
      setMsg("Server error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setSweets([]);
    navigate("/login");
  };

  const handlePurchase = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sweets/${id}/purchase`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {

        setSweets(prev => prev.map(s =>
          s._id === id ? { ...s, quantity: s.quantity - 1 } : s
        ));
      } else {
        alert("Purchase failed or Out of Stock");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSweet = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/sweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSweet)
      });
      const data = await res.json();
      if (res.ok) {
        setSweets([...sweets, data]);
        setNewSweet({ name: "", category: "", price: "", quantity: "" });
        alert("Sweet added to the galaxy!");
      } else {
        alert("Failed to add sweet");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/sweets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSweets(prev => prev.filter(s => s._id !== id));
      } else {
        alert("Failed to delete (Admins Only)");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestock = async (id) => {
    const amount = prompt("Enter amount to restock:", "10");
    if (!amount) return;

    try {
      const res = await fetch(`http://localhost:5000/api/sweets/${id}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseInt(amount) })
      });
      if (res.ok) {
        const updatedSweet = await res.json();
        setSweets(prev => prev.map(s => s._id === id ? updatedSweet : s));
      } else {
        alert("Failed to restock (Admins Only)");
      }
    } catch (err) {
      console.error(err);
    }
  };



  const filteredSweets = sweets.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      {token && <Navbar onLogout={handleLogout} />}

      <Routes>
        <Route path="/login" element={
          !token ? <AuthForm type="login" onSubmit={handleLogin} message={msg} /> : <Navigate to="/" />
        } />

        <Route path="/register" element={
          !token ? <AuthForm type="register" onSubmit={handleRegister} message={msg} /> : <Navigate to="/" />
        } />

        <Route path="/" element={
          token ? (
            <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    borderRadius: "30px",
                    border: "none",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    backdropFilter: "blur(5px)"
                  }}
                />
              </div>

              <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem", borderRadius: "16px" }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--color-primary)" }}>Add New Specimen</h3>
                <form onSubmit={handleAddSweet} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                  <input placeholder="Name" value={newSweet.name} onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} className="glass-input" required />
                  <input placeholder="Category" value={newSweet.category} onChange={e => setNewSweet({ ...newSweet, category: e.target.value })} className="glass-input" required />
                  <input type="number" placeholder="Price" value={newSweet.price} onChange={e => setNewSweet({ ...newSweet, price: e.target.value })} className="glass-input" required />
                  <input type="number" placeholder="Qty" value={newSweet.quantity} onChange={e => setNewSweet({ ...newSweet, quantity: e.target.value })} className="glass-input" required />
                  <button type="submit" className="purchase-btn" style={{ height: "100%" }}>Add</button>
                </form>
              </div>


              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "2rem"
              }}>
                {filteredSweets.map(sweet => (
                  <SweetCard
                    key={sweet._id}
                    sweet={sweet}
                    onPurchase={() => handlePurchase(sweet._id)}
                    isAdmin={role === 'admin'}
                    onDelete={handleDelete}
                    onRestock={handleRestock}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>


      <style>{`
        .glass-input {
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
        }
        .glass-input:focus {
           outline: none;
           border-color: var(--color-accent);
        }
      `}</style>
    </div>
  );
}

export default App;
