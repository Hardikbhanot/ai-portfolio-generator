import { useState } from "react";
import api from "../api";

function ResumeForm() {
  const [userId, setUserId] = useState("");
  const [resumeText, setResumeText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/resumes/${userId}`, resumeText, {
        headers: { "Content-Type": "text/plain" },
      });
      alert("Resume uploaded! Resume ID: " + res.data.id);
    } catch (err) {
      console.error(err);
      alert("Error uploading resume");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Resume</h2>
      <input
        type="number"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <textarea
        placeholder="Paste your resume here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <button type="submit">Upload</button>
    </form>
  );
}

export default ResumeForm;
