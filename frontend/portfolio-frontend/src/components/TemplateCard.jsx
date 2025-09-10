// src/components/TemplateCard.js
import React from "react";
import { motion } from "framer-motion";
import { Eye as EyeIcon } from "lucide-react";

const TemplateCard = ({ template, isSelected, onSelect, onPreview }) => {
  return (
    <motion.div
      onClick={() => onSelect(template.id)}
      className={`cursor-pointer rounded-xl border-2 transition-all duration-300 ${
        isSelected
          ? "border-indigo-500 ring-4 ring-indigo-500/30"
          : "border-gray-300 dark:border-gray-700"
      }`}
      whileHover={{ scale: 1.05, y: -5 }}
      layout
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img src={template.thumbnail} alt={template.name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                onPreview(template);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 text-black font-semibold rounded-lg backdrop-blur-sm hover:bg-white"
            >
              <EyeIcon size={18} /> Preview
            </button>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{template.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
      </div>
    </motion.div>
  );
};

export default TemplateCard;