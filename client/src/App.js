import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);

  const API = "http://localhost:5000";

  const login = async () => {
    const res = await axios.post(`${API}/api/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    alert("Login successful");
    getExpenses();
  };

  const getExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(`${API}/api/expenses`, {
      headers: { Authorization: token },
    });

    setExpenses(res.data);
  };

  const addExpense = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      `${API}/api/expenses`,
      { title, amount: Number(amount), category },
      {
        headers: { Authorization: token },
      }
    );

    setTitle("");
    setAmount("");
    getExpenses();
  };

  const deleteExpense = async (id) => {
    const token = localStorage.getItem("token");

    await axios.delete(`${API}/api/expenses/${id}`, {
      headers: { Authorization: token },
    });

    getExpenses();
  };

  useEffect(() => {
    getExpenses();
  }, []);

  // 💡 TOTAL
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // 📊 GROUP BY CATEGORY
  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + Number(e.amount);
  });

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
      },
    ],
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>💰 Expense Tracker</h1>

      {/* LOGIN */}
      <div style={card}>
        <h3>Login</h3>
        <input
          style={input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={button} onClick={login}>
          Login
        </button>
      </div>

      {/* ADD EXPENSE */}
      <div style={card}>
        <h3>Add Expense</h3>
        <input
          style={input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={input}
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          style={input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
        </select>

        <button style={button} onClick={addExpense}>
          Add Expense
        </button>
      </div>

      {/* TOTAL */}
      <div style={card}>
        <h3>Total Spent: ${total}</h3>
      </div>

      {/* EXPENSE LIST */}
      <div style={card}>
        <h3>My Expenses</h3>
        {expenses.map((exp) => (
          <div key={exp._id} style={expenseItem}>
            <span>
              {exp.title} - ${exp.amount} ({exp.category})
            </span>
            <button onClick={() => deleteExpense(exp._id)}>❌</button>
          </div>
        ))}
      </div>

      {/* PIE CHART */}
      <div style={card}>
        <h3>Spending by Category</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
}

// 🎨 STYLES
const card = {
  background: "#ffffff",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0)",
};

const input = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
};

const button = {
  padding: "10px",
  width: "100%",
  background: "#e5ff00",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const expenseItem = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

export default App;