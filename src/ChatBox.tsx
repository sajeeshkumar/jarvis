import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// Base URLs from environment variables
const engineeringApiBaseUrl = import.meta.env.VITE_ENGINEERING_API_BASE_URL;
const solutionArchitectApiBaseUrl = import.meta.env.VITE_SOLUTION_ARCHITECT_API_BASE_URL;

const ChatBox: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [advisorType, setAdvisorType] = useState<string>("engineeringmanagement"); // Default advisor type

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const apiBaseUrl =
        advisorType === "engineeringmanagement"
          ? engineeringApiBaseUrl
          : solutionArchitectApiBaseUrl;

      const res = await axios.post(`${apiBaseUrl}/query`, {
        prompt: query,
      });
      setResponse(res.data.response);
    } catch (error) {
      setResponse("Error: Unable to fetch response. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Chat with Jarvis</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Select Advisor:</label>
        <select
          style={styles.select}
          value={advisorType}
          onChange={(e) => setAdvisorType(e.target.value)}
        >
          <option value="engineeringmanagement">Engineering Management Advisor</option>
          <option value="solutionarchitect">Solution Architect Advisor</option>
        </select>

        <label style={styles.label}>Your question:</label>
        <textarea
          style={styles.textarea}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question here..."
          required
        />
        <button type="submit" style={styles.button}>
          {loading ? "Asking Jarvis..." : "Ask Jarvis"}
        </button>
      </form>

      {response && (
        <div style={styles.response}>
          <h2>Jarvis's Response:</h2>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    color: "#333",
    fontSize: "24px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    maxWidth: "800px",
  },
  label: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#555",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
  },
  textarea: {
    padding: "15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "150px",
    resize: "vertical",
    width: "100%",
  },
  button: {
    padding: "12px 25px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
  response: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
    minHeight: "200px",
    overflowY: "auto",
    width: "100%",
    maxWidth: "800px",
  },
};

export default ChatBox;
