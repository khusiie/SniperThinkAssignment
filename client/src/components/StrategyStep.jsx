import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Bell, TrendingUp, UserCheck } from 'lucide-react';
import InterestForm from './InterestForm';
import { StrategyMagicCard } from './StrategyMagicCard';

const icons = {
  activity: Activity,
  bell: Bell,
  "trending-up": TrendingUp,
  "user-check": UserCheck,
};

const StrategyStep = ({ step, index, total }) => {
  const Icon = icons[step.icon];
  const isEven = index % 2 === 0;
  const sectionRef = useRef(null);

  // Lifted from InterestForm — controls expand/collapse
  const [expanded, setExpanded] = useState(false);

  // Close form when section scrolls out of view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section is less than 20% visible, collapse the form
        if (!entry.isIntersecting) {
          setExpanded(false);
        }
      },
      {
        // Fire when section drops below 20% visibility
        threshold: 0.20,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section
      ref={sectionRef}
      id={`step-${step.id}`}
      className="strategy-step-section"
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "8rem 3rem",
        backgroundColor: "oklch(0.145 0 0)",
      }}
    >
      {/* Big background number */}
      <div style={{
        position: "absolute",
        fontSize: "clamp(160px, 28vw, 340px)",
        fontWeight: "900",
        color: "white",
        opacity: 0.025,
        zIndex: 0,
        pointerEvents: "none",
        lineHeight: 1,
        [isEven ? 'left' : 'right']: "2rem",
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "var(--font-heading)",
        userSelect: "none",
      }}>
        0{step.id}
      </div>

      {/* Subtle radial glow */}
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: isEven
          ? "radial-gradient(circle, rgba(107,33,239,0.07) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(238,79,39,0.07) 0%, transparent 70%)",
        [isEven ? 'left' : 'right']: "0",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Main grid */}
      <div className="strategy-step-grid" style={{
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "5rem",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Card side */}
        <motion.div
          style={{ order: isEven ? 1 : 2 }}
          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <StrategyMagicCard step={step} isEven={isEven} />
        </motion.div>

        {/* Text content side */}
        <motion.div
          style={{ order: isEven ? 2 : 1 }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Step badge */}
          <motion.div variants={itemVariants}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.02)",
              marginBottom: "28px",
            }}>
              {Icon && (
                <div style={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.5)",
                }}>
                  <Icon size={14} />
                </div>
              )}
              <span style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                fontWeight: "500",
                letterSpacing: "0.04em",
              }}>
                Step {String(step.id).padStart(2, '0')} · Workflow Optimization
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            style={{
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: "700",
              color: "white",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: "28px",
            }}
          >
            {step.title}
          </motion.h2>

          {/* Tags */}
          <motion.div
            variants={itemVariants}
            style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}
          >
            {(step.title === "AI Sales Agents"
              ? ["First-touch Sales", "Lead Qualifying", "Precision Outreach"]
              : ["AI Intelligence", "Real-time Metrics", "Predictive Signals"]
            ).map((tag) => (
              <div key={tag} style={{
                padding: "8px 18px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.01em",
              }}>
                {tag}
              </div>
            ))}
          </motion.div>

          {/* Form — expanded state now lives here and collapses on scroll */}
          <motion.div variants={itemVariants} style={{ maxWidth: "440px" }}>
            <InterestForm
              stepTitle={step.title}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          </motion.div>

        </motion.div>
      </div>

      {/* Bottom divider line */}
      {index < total - 1 && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)",
        }} />
      )}
    </section>
  );
};

export default StrategyStep;