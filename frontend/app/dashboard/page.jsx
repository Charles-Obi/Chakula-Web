"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Expiry check
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setUser(decoded);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Proper loading state
  if (!user) {
    return <p style={styles.loading}>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>

      <div style={styles.card}>
        <h2>Welcome, {user.username} 👋</h2>
        <p><strong>Email:</strong> {user.sub}</p>
      </div>

      <button onClick={logout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

// Simple styling
const styles = {
  container: {
    maxWidth: "600px",
    margin: "80px auto",
    textAlign: "center",
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "18px",
  },
};
