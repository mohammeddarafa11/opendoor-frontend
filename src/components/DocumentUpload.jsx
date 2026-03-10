import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  Trash2,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const DocumentUpload = ({ reservationId, documents = [], onUpdate }) => {
  const [uploading, setUploading] = useState({});
  const fileInputRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null);

  const docTypes = [
    {
      key: "national_id",
      label: "National ID Copy",
      required: true,
      icon: "🪪",
    },
    {
      key: "proof_of_address",
      label: "Proof of Address",
      required: false,
      icon: "🏠",
    },
    {
      key: "contract",
      label: "Signed Contract",
      required: false,
      icon: "📄",
      downloadOnly: true,
    },
    {
      key: "receipt",
      label: "Payment Receipt",
      required: false,
      icon: "🧾",
      downloadOnly: true,
    },
  ];

  const getDocStatus = (key) => {
    return documents.find((d) => d.type === key);
  };

  const handleUpload = async (file, docType) => {
    if (!file) return;

    // Validate
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Use JPG, PNG, WebP, or PDF.");
      return;
    }

    setUploading((prev) => ({ ...prev, [docType]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", docType);
      formData.append("reservation", reservationId);

      await api.post("/reservations/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully");
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [docType]: false }));
    }
  };

  const triggerFileInput = (docType) => {
    setSelectedType(docType);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedType) {
      handleUpload(file, selectedType);
    }
    e.target.value = "";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        Documents
      </h3>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={handleFileChange}
      />

      <div className="space-y-3">
        {docTypes.map((doc) => {
          const existing = getDocStatus(doc.key);
          const isUploading = uploading[doc.key];

          return (
            <div
              key={doc.key}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                existing
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{doc.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {doc.label}
                    {doc.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>
                  {existing && (
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3" />
                      Uploaded{" "}
                      {new Date(existing.uploaded_at).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {existing ? (
                  <>
                    <a
                      href={existing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    {!doc.downloadOnly && (
                      <button
                        onClick={() => triggerFileInput(doc.key)}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Replace"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    )}
                  </>
                ) : doc.downloadOnly ? (
                  <span className="text-xs text-gray-400">Pending</span>
                ) : isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                ) : (
                  <button
                    onClick={() => triggerFileInput(doc.key)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Accepted formats: JPG, PNG, WebP, PDF (max 10MB)
      </p>
    </div>
  );
};

export default DocumentUpload;
