"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onChange(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="image-upload">
      <label className="image-upload-label">{label}</label>

      <div
        className={`image-upload-dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="Preview" className="image-upload-preview" />
        ) : (
          <div className="image-upload-placeholder">
            {uploading ? "Uploading..." : "Drag & drop an image, or click to browse"}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleSelect}
          style={{ display: "none" }}
        />
      </div>

      {value && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste an image URL"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="btn btn-small btn-danger"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        </div>
      )}

      {!value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste an image URL"
          style={{ marginTop: "0.5rem" }}
        />
      )}

      {error && <p className="auth-error" style={{ marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
