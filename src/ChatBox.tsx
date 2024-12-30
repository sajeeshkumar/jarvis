import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const engineeringApiBaseUrl = import.meta.env.VITE_ENGINEERING_API_BASE_URL;
const solutionArchitectApiBaseUrl = import.meta.env.VITE_ENGINEERING_API_BASE_URL;

const ChatBox: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [fileResults, setFileResults] = useState<{ file_name: string; chunk: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [advisorType, setAdvisorType] = useState<string>("engineeringmanagement"); // Default advisor type
  const [selectedExcerpt, setSelectedExcerpt] = useState<string | null>(null);

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

      const res = await axios.post(`${apiBaseUrl}`, {
        prompt: query,
      });

      const { response: responseText, search_results: searchResults } = res.data;
      setResponse(responseText);
      setFileResults(
        searchResults.map((result: any) => ({
          file_name: result.file_name,
          chunk: result.chunk,
        }))
      );
    } catch (error) {
      setResponse("Error: Unable to fetch response. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openExcerptPopup = (excerpt: string) => {
    setSelectedExcerpt(excerpt);
  };

  const closeExcerptPopup = () => {
    setSelectedExcerpt(null);
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
            <ReactMarkdown>
              {response}
            </ReactMarkdown>
            {fileResults.length > 0 && (
              <div style={styles.referencesSection}>
                <h3>References:</h3>
                <ul style={styles.referencesList}>
                  {fileResults.map((file, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        style={styles.referenceLink}
                        onClick={(e) => {
                          e.preventDefault();
                          openExcerptPopup(file.chunk);
                        }}
                      >
                        {file.file_name} (Reference {index + 1})
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedExcerpt && (
        <div style={styles.popupOverlay} onClick={closeExcerptPopup}>
          <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closeExcerptPopup}>
              &times;
            </button>
            <h3>Excerpt</h3>
            <p>{selectedExcerpt}</p>
          </div>
        </div>
      )}
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
    maxWidth: "600px", // Adjusted for centering
    margin: "0 auto",  // Centers the form horizontally
  },
  label: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",  // Center-align the labels
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    textAlign: "center", // Center-align the select options
  },
  textarea: {
    padding: "15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "200px", // Increased height of textarea
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
  referencesSection: {
    marginTop: "20px",
  },
  referencesList: {
    listStyle: "none",
    padding: 0,
  },
  referenceLink: {
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "600px",
    position: "relative",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
};

export default ChatBox;
  