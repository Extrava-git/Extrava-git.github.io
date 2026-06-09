'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Sliders,
  ChevronRight,
  Zap,
  Wifi,
  LucideIcon,
} from 'lucide-react';

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type ProductId = 'left' | 'right';

export interface FeatureMetric {
  label: string;
  value: number; // 0-100
  icon: LucideIcon;
}

export interface ProductData {
  id: ProductId;
  label: string; 
  title: string;
  description: string;
  image: string;
  colors: {
    glow: string;     // Tailwind color class for accents
    ring: string;     // Tailwind border color for rings
  };
  features: FeatureMetric[];
}

const PRODUCT_DATA: Record<ProductId, ProductData> = {
  left: {
    id: 'left',
    label: 'Reference',
    title: 'Reference Sensor',
    description: 'The primary node for binaural synchronization. Handles low-latency transmission and anchors the spatial audio soundstage.',
    image: '/patch-reference.png', // Placeholder
    colors: {
      glow: 'bg-blue-500',
      ring: 'border-blue-500/50',
    },
    features: [
      { label: 'Latency', value: 12, icon: Zap },
      { label: 'Sync Rate', value: 98, icon: Wifi },
    ],
  },
  right: {
    id: 'right',
    label: 'Actual',
    title: 'Actual Sensor',
    description: 'Optimized for high-frequency detail and voice pickup. Contains the beamforming microphone array for crystal clear calls.',
    image: '/patch-actual.png', // Placeholder
    colors: {
      glow: 'bg-emerald-500',
      ring: 'border-emerald-500/50',
    },
    features: [
      { label: 'Sensitivity', value: 94, icon: Zap },
      { label: 'Precision', value: 88, icon: Wifi },
    ],
  },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const ANIMATIONS: Record<string, Variants> = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 20 } as any,
    },
    exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
  },
  image: (): Variants => ({
    initial: {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 260, damping: 20 } as any,
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
      transition: { duration: 0.25 },
    },
  }),
};

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const ProductVisual = ({ data }: { data: ProductData }) => (
  <motion.div layout="position" className="relative group shrink-0">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className={`absolute inset-[-10%] rounded-lg border border-dashed border-white/10 ${data.colors.ring}`}
    />
    
    <div className="relative h-64 w-64 md:h-[400px] md:w-[400px] rounded-lg border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={data.id}
          variants={ANIMATIONS.image()}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full p-8"
        >
          {/* Replace this with an actual image, using a placeholder for now */}
          <div className="w-full h-full bg-zinc-700 rounded-md" />
        </motion.div>
      </AnimatePresence>
    </div>
  </motion.div>
);

const ProductDetails = ({ data }: { data: ProductData }) => {
  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-start text-left"
    >
      <motion.h2 variants={ANIMATIONS.item} className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
        {data.label}
      </motion.h2>
      <motion.h1 variants={ANIMATIONS.item} className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
        {data.title}
      </motion.h1>
      <motion.p variants={ANIMATIONS.item} className="text-zinc-400 mb-8 max-w-sm leading-relaxed">
        {data.description}
      </motion.p>

      <motion.div variants={ANIMATIONS.item} className="w-full space-y-6 bg-zinc-900/40 p-6 rounded-lg border border-white/5 backdrop-blur-sm">
        {data.features.map((feature, idx) => (
          <div key={feature.label} className="group">
            <div className="flex items-center justify-between mb-3 text-sm">
              <div className="flex items-center gap-2 text-zinc-200">
                <feature.icon size={16} /> <span>{feature.label}</span>
              </div>
              <span className="font-mono text-xs text-zinc-500">{feature.value}%</span>
            </div>
            <div className="relative h-2 w-full bg-zinc-800 rounded-sm overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feature.value}%` }}
                transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                className={`absolute top-0 bottom-0 left-0 bg-white opacity-80`}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const Switcher = ({ 
  activeId, 
  onToggle 
}: { 
  activeId: ProductId; 
  onToggle: (id: ProductId) => void 
}) => {
  const options = Object.values(PRODUCT_DATA).map(p => ({ id: p.id, label: p.label }));

  return (
    <div className="mt-12 flex justify-center">
      <div className="flex items-center gap-1 p-1 rounded-md bg-zinc-900/80 border border-white/10">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            className={`w-32 py-2 rounded-sm text-sm font-medium transition-colors ${activeId === opt.id ? 'bg-white text-black' : 'text-zinc-500'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// =========================================
// 4. MAIN COMPONENT
// =========================================

export default function EarbudShowcase() {
  const [activeSide, setActiveSide] = useState<ProductId>('left');
  
  const currentData = PRODUCT_DATA[activeSide];

  return (
    <div className="relative w-full bg-black text-zinc-100 p-8 md:p-16">
      <main className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16">
        <ProductVisual data={currentData} />
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <ProductDetails 
              key={activeSide}
              data={currentData} 
            />
          </AnimatePresence>
        </div>
      </main>
      <Switcher activeId={activeSide} onToggle={setActiveSide} />
    </div>
  );
}
