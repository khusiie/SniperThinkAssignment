import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X, BarChart3, Clock } from 'lucide-react';

const FileUploadView = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | processing | success | error
  const [jobId, setJobId] = useState(null);
  const [jobResult, setJobResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    // Only accept txt, pdf, jpg, png (matching backend)
    const validTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png'];
    const validExtensions = ['.txt', '.pdf', '.jpg', '.jpeg', '.png'];
    
    const isExtensionValid = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
    
    if (validTypes.includes(selectedFile.type) || isExtensionValid) {
      setFile(selectedFile);
      setStatus('idle');
      setJobResult(null);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid file type. Please upload a PDF, TXT, JPG, or PNG.');
      setStatus('error');
    }
  };

  const clearSelection = () => {
    setFile(null);
    setStatus('idle');
    setJobId(null);
    setJobResult(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'user_123'); // Fixed user for demo purposes

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setJobId(data.jobId);
      setStatus('processing');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Upload failed. Please check server connection.');
    }
  };

  // Poll for job status
  useEffect(() => {
    let interval;
    
    const checkJobStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/job/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          
          if (data.status === 'COMPLETED') {
            setJobResult(data.result);
            setStatus('success');
            clearInterval(interval);
          } else if (data.status === 'FAILED') {
            setStatus('error');
            setErrorMessage('Processing failed on the server.');
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Error polling job status:', err);
      }
    };

    if (status === 'processing' && jobId) {
      interval = setInterval(checkJobStatus, 2000); // Poll every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, jobId]);

  return (
    <div style={{
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "24px",
      background: "rgba(10,10,10,0.6)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "24px",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      fontFamily: "'Inter', sans-serif"
    }}>
      
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h2 style={{ color: "white", fontSize: "20px", fontWeight: "600", margin: "0 0 8px 0" }}>
          Neural Document Processing
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
          Upload Intel (PDF, TXT, Images) for deep semantic analysis
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Dropzone State */}
        {status === 'idle' && !file && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "48px 24px",
              border: `2px dashed ${isDragging ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: "16px",
              background: isDragging ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect}
              accept=".pdf,.txt,.jpg,.jpeg,.png"
            />
            
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              color: isDragging ? "#10b981" : "rgba(255,255,255,0.4)"
            }}>
              <UploadCloud size={32} />
            </div>
            
            <p style={{ color: "white", fontSize: "16px", fontWeight: "500", margin: "0 0 8px" }}>
              Drag & drop intel here
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
              or click to browse local files
            </p>
          </motion.div>
        )}

        {/* Selected File / Processing State */}
        {(file && status !== 'success') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "10px", background: "rgba(16,185,129,0.1)", borderRadius: "10px", color: "#10b981" }}>
                  <FileText size={20} />
                </div>
                <div>
                  <p style={{ color: "white", fontSize: "14px", fontWeight: "500", margin: "0 0 4px" }}>
                    {file.name}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              
              {status === 'idle' && (
                <button 
                  onClick={clearSelection}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: "4px" }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div style={{
                padding: "12px", background: "rgba(248,113,113,0.1)", 
                border: "1px solid rgba(248,113,113,0.2)", borderRadius: "10px",
                color: "#f87171", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
                marginBottom: "16px"
              }}>
                <AlertCircle size={16} />
                {errorMessage}
              </div>
            )}

            {/* Action Area */}
            {status === 'idle' || status === 'error' ? (
              <button
                onClick={handleUpload}
                style={{
                  width: "100%", padding: "14px", background: "white", color: "black",
                  border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                Initiate Analysis Sequence
              </button>
            ) : (
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                  <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                    {status === 'uploading' ? 'Uplinking to Core...' : 'Neural Workers Processing...'}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>
                    {status === 'uploading' ? '10%' : '50%'}
                  </span>
                </div>
                {/* Progress Bar Track */}
                <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                  {/* Progress Fill */}
                  <motion.div 
                    initial={{ width: "5%" }}
                    animate={{ width: status === 'uploading' ? "10%" : status === 'processing' ? "75%" : "100%" }}
                    transition={{ duration: 2, ease: "linear" }}
                    style={{ height: "100%", background: "#10b981", borderRadius: "2px", boxShadow: "0 0 10px #10b981" }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Success Results State */}
        {status === 'success' && jobResult && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "rgba(16,185,129,0.05)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#10b981", marginBottom: "20px" }}>
              <CheckCircle2 size={24} />
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Analysis Complete</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              {/* Stat Card 1 */}
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "8px" }}>
                  <BarChart3 size={14} /> Total Words
                </div>
                <div style={{ color: "white", fontSize: "24px", fontWeight: "700" }}>{jobResult.wordCount}</div>
              </div>

              {/* Stat Card 2 */}
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "8px" }}>
                  <FileText size={14} /> Paragraphs
                </div>
                <div style={{ color: "white", fontSize: "24px", fontWeight: "700" }}>{jobResult.paragraphCount}</div>
              </div>
            </div>

            {/* Keywords */}
            {jobResult.keywords && jobResult.keywords.length > 0 && (
              <div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Extracted Entities
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {jobResult.keywords.map((kw, i) => (
                    <span key={i} style={{ 
                      padding: "6px 12px", background: "rgba(16,185,129,0.1)", 
                      border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", 
                      borderRadius: "20px", fontSize: "13px", fontWeight: "500" 
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
               onClick={clearSelection}
               style={{
                 width: "100%", padding: "12px", background: "transparent", color: "white",
                 border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", fontSize: "13px",
                 marginTop: "24px", cursor: "pointer", transition: "all 0.2s"
               }}
               onMouseEnter={(e) => {
                 e.target.style.background = "rgba(255,255,255,0.1)";
               }}
               onMouseLeave={(e) => {
                 e.target.style.background = "transparent";
               }}
            >
              Analyze Another Document
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FileUploadView;
