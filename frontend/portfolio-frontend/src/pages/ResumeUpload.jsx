import React from "react";

function ResumeUploadPage() {
  return (
    <div className="flex justify-center items-center h-screen -mt-20">
      <div className="bg-white/40 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-[28rem]">
        <h2 className="text-2xl font-semibold text-center mb-6">Upload Resume</h2>
        <form className="space-y-6">
          <input
            type="file"
            className="w-full p-3 border rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700"
          />
          <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Upload & Generate Portfolio
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResumeUploadPage;
