import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

const InterestForm = ({ stepTitle, expanded, setExpanded }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Improved URL detection for Render/Deploys
      let apiUrl = import.meta.env.VITE_API_URL;
      
      if (!apiUrl) {
        const hostname = window.location.hostname;
        if (hostname.includes('onrender.com')) {
          const serverName = hostname.replace('-client', '-server');
          apiUrl = `https://${serverName}`;
          console.log('⚠️ VITE_API_URL missing, inferred server URL:', apiUrl);
        } else {
          apiUrl = 'http://localhost:5000';
          console.log('⚠️ VITE_API_URL missing, falling back to local:', apiUrl);
        }
      }

      console.log('🚀 Sending interest to:', `${apiUrl}/api/interest`);
      const response = await fetch(`${apiUrl}/api/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, step: stepTitle }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Interest registered successfully.');
        setFormData({ name: '', email: '' });
        setExpanded(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server error');
      }
    } catch (err) {
      console.error('❌ INTEREST ERROR:', err);
      setStatus('error');
      setMessage(err.message || 'Connection failed. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 32px",
          background: "rgba(16,185,129,0.04)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "16px",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <div style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <CheckCircle2 size={24} color="#10b981" />
        </div>

        <div>
          <p style={{
            color: "#10b981",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "0 0 6px",
          }}>
            Success
          </p>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "14px",
            margin: 0,
          }}>
            {message}
          </p>
        </div>

        <button
          onClick={() => setStatus('idle')}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.25)",
            fontSize: "12px",
            cursor: "pointer",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 0",
            marginTop: "4px",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
        >
          Submit another <ChevronRight size={12} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Inputs — only show when expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Name input */}
              <input
                type="text"
                required
                value={formData.name}
                placeholder="Your name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${focused === 'name' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
              />

              {/* Email input */}
              <input
                type="email"
                required
                value={formData.email}
                placeholder="Your email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${focused === 'email' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          type={expanded ? "submit" : "button"}
          onClick={!expanded ? () => setExpanded(true) : undefined}
          disabled={status === 'loading'}
          whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
          whileTap={{ scale: status === 'loading' ? 1 : 0.97 }}
          style={{
            width: "100%",
            padding: "16px",
            background: "white",
            color: "black",
            border: "none",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "700",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: status === 'loading' ? "not-allowed" : "pointer",
            opacity: status === 'loading' ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "opacity 0.2s ease",
          }}
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Processing...
            </>
          ) : expanded ? (
            <>
              Submit
              <ChevronRight size={16} />
            </>
          ) : (
            <>
              Initiate Interest
              <ChevronRight size={16} />
            </>
          )}
        </motion.button>

        {/* Error message */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#f87171",
                fontSize: "13px",
                padding: "10px 14px",
                background: "rgba(248,113,113,0.06)",
                border: "1px solid rgba(248,113,113,0.15)",
                borderRadius: "10px",
              }}
            >
              <AlertCircle size={14} />
              {message}
            </motion.div>
          )}
        </AnimatePresence>

      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </motion.div>
  );
};

export default InterestForm;