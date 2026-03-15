import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { strategySteps } from '../data/strategySteps';
import StrategyStep from './StrategyStep';

const StrategyFlow = () => {
  const containerRef = React.useRef(null);

  // High-precision scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Tactical Overlays */}
      <div className="hud-grid" />
      <div className="hud-dots" />
      <div className="scan-line" />

      {/* Strategy Steps - Sticky Stack */}
      <div className="relative">
        {strategySteps.map((step, index) => (
          <StrategyStep
            key={step.id}
            step={step}
            index={index}
            total={strategySteps.length}
          />
        ))}
      </div>
    </div>
  );
};

export default StrategyFlow;
