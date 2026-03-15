import React, { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence } from "framer-motion"

export function StrategyMagicCard({ step, isEven }) {
  const cardRef = useRef(null)
  const wrapperRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [scrollGlow, setScrollGlow] = useState(false)

  // Mouse position as % of card (0–100) for blob + conic gradient
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  // Angle from center — rotates the conic spotlight around the border
  const [angle, setAngle] = useState(0)

  // --- Mouse tilt (spring-smoothed) ---
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6])

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()

    // Normalized -0.5..0.5 for tilt
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)

    // 0–100% for blob and conic position
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })

    // Angle from card center for conic gradient rotation
    const cx = e.clientX - rect.left - rect.width / 2
    const cy = e.clientY - rect.top - rect.height / 2
    setAngle(Math.atan2(cy, cx) * (180 / Math.PI) + 90)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  // --- Scroll glow ---
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrollGlow(entry.isIntersecting),
      { threshold: 0.4 }
    )
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  // --- Parallax ---
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [120, -120])
  const parallaxRotate = useTransform(scrollYProgress, [0, 0.5, 1], [3, 0, -3])
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.02, 0.95])

  // --- Border logic ---
  // Hover   → conic spotlight that tracks mouse angle (orange → purple arc)
  // Scroll  → static soft purple top-fade
  // Neither → nearly invisible dim edge
  const borderBackground = hovered
    ? `conic-gradient(from ${angle}deg at ${mousePos.x}% ${mousePos.y}%, #ee4f27 0deg, #c040f0 45deg, #6b21ef 90deg, transparent 140deg, transparent 220deg, #6b21ef 270deg, #ee4f27 360deg)`
    : scrollGlow
      ? "linear-gradient(to bottom, rgba(107,33,239,0.5) 0%, rgba(107,33,239,0.1) 55%, transparent 100%)"
      : "linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, transparent 60%)"

  return (
    <div ref={wrapperRef}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          y: parallaxY,
          scale: parallaxScale,
          rotateZ: parallaxRotate,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transformPerspective: 1000,
        }}
      >
        {/* Border shell — conic gradient spotlight follows mouse on hover */}
        <div
          style={{
            position: "relative",
            borderRadius: "32px",
            padding: "2px",
            background: borderBackground,
            // Instant update on hover (tracks mouse), smooth transition when leaving
            transition: hovered ? "none" : "background 0.7s ease",
          }}
        >
          {/* Ambient glow blob */}
          <AnimatePresence>
            {(scrollGlow || hovered) && (
              <motion.div
                key="glow-blob"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  width: 340,
                  height: 340,
                  borderRadius: "50%",
                  background: isEven
                    ? "radial-gradient(circle, rgba(107,33,239,0.32), transparent 70%)"
                    : "radial-gradient(circle, rgba(238,79,39,0.28), transparent 70%)",
                  left: hovered ? `${mousePos.x}%` : "50%",
                  top: hovered ? `${mousePos.y}%` : "40%",
                  translateX: "-50%",
                  translateY: "-50%",
                  pointerEvents: "none",
                  zIndex: 0,
                  filter: "blur(50px)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Inner card */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              borderRadius: "30px",
              background: "oklch(0.145 0 0)",
              padding: "40px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ee4f27, #6b21ef)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "700",
                color: "white",
                flexShrink: 0,
              }}>
                {step.id}
              </div>
              <div>
                <p style={{ color: "white", fontWeight: "700", fontSize: "17px", margin: 0 }}>
                  {step.title}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: "3px 0 0" }}>
                  Workflow Automation v2.0
                </p>
              </div>
            </div>

            {/* Content */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{
                color: "rgba(255,255,255,0.9)",
                fontWeight: "600",
                fontSize: "18px",
                lineHeight: "1.4",
                margin: "0 0 12px",
              }}>
                High-Performance Strategy Execution
              </p>
              <p style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "15px",
                lineHeight: "1.7",
                margin: 0,
              }}>
                {step.description}
              </p>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "Status", value: "Active" },
                { label: "Priority", value: "Critical" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                }}>
                  <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "700", margin: "0 0 4px" }}>
                    {label}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}