import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const engineeringApiBaseUrl = import.meta.env.VITE_ENGINEERING_API_BASE_URL;
const solutionArchitectApiBaseUrl = import.meta.env.VITE_SOLUTION_ARCHITECT_API_BASE_URL;

const ChatBox: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [fileResults, setFileResults] = useState<{ file_name: string; chunk: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [advisorType, setAdvisorType] = useState<string>("engineeringmanagement"); // Default advisor type

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setFileResults([]);

    try {
      const apiBaseUrl =
        advisorType === "engineeringmanagement"
          ? engineeringApiBaseUrl
          : solutionArchitectApiBaseUrl;

      const res = await axios.post(`${apiBaseUrl}/query`, {
        prompt: query,
      });

      const { response: responseText, search_results: searchResults } = res.data;
      setResponse(responseText);
      setFileResults(searchResults.map((result: any) => ({
        file_name: result.file_name,
        chunk: result.chunk,
      })));
    } catch (error) {
      setResponse("Error: Unable to fetch response. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showExcerptPopup = (excerpt: string) => {
    alert(excerpt);
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

      <div style={styles.contentContainer}>
        {response && (
          <div style={styles.response}>
            <h2>Jarvis's Response:</h2>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}

        {fileResults.length > 0 && (
          <div style={styles.references}>
            <h3>References:</h3>
            <ul style={styles.fileList}>
              {fileResults.map((file, index) => (
                <li key={index} style={styles.fileItem}>
                  <span>{file.file_name}</span>{" "}
                  <button
                    style={styles.linkButton}
                    onClick={() => showExcerptPopup(file.chunk)}
                  >
                    Show Excerpt
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
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
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "20px",
    width: "100%",
    maxWidth: "1200px",
  },
  response: {
    flex: 2,
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
    overflowY: "auto",
  },
  references: {
    flex: 1,
    marginLeft: "20px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  fileList: {
    listStyle: "none",
    padding: 0,
  },
  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "14px",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ChatBox;
