import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, BrainCircuit, Boxes, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

const businessNodes = [
  { label: 'Coffee', icon: '☕', x: '11%', y: '61%', delay: 0, color: 'from-amber-300 to-orange-400' },
  { label: 'Tailor', icon: '🧵', x: '24%', y: '49%', delay: 0.25, color: 'from-fuchsia-300 to-pink-400' },
  { label: 'Mechanic', icon: '🔧', x: '39%', y: '65%', delay: 0.5, color: 'from-slate-200 to-cyan-300' },
  { label: 'Restaurant', icon: '🍲', x: '58%', y: '52%', delay: 0.75, color: 'from-emerald-300 to-lime-400' },
  { label: 'Makers', icon: '⚙️', x: '76%', y: '62%', delay: 1, color: 'from-violet-300 to-blue-400' },
  { label: 'Coders', icon: '💻', x: '86%', y: '44%', delay: 1.25, color: 'from-cyan-300 to-emerald-400' },
];

const metrics = [
  { label: 'Revenue', value: '+38%', x: '12%', y: '23%', delay: 0.1 },
  { label: 'Inventory', value: 'Live', x: '70%', y: '22%', delay: 0.45 },
  { label: 'Demand', value: '7d ↑', x: '45%', y: '16%', delay: 0.8 },
  { label: 'Customers', value: '2.4k', x: '82%', y: '78%', delay: 1.1 },
  { label: 'Growth', value: 'AI', x: '27%', y: '79%', delay: 1.4 },
];

const silhouettes = [
  { x: '16%', delay: 0, duration: 12 },
  { x: '34%', delay: 2, duration: 15 },
  { x: '62%', delay: 1, duration: 14 },
  { x: '78%', delay: 3, duration: 16 },
];

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  x: `${(index * 29) % 96}%`,
  y: `${14 + ((index * 17) % 74)}%`,
  delay: (index % 8) * 0.28,
  duration: 6 + (index % 6),
}));

const skyline = [
  'h-28 w-10', 'h-40 w-14', 'h-32 w-12', 'h-52 w-16', 'h-36 w-10', 'h-48 w-20', 'h-30 w-12', 'h-44 w-14', 'h-60 w-16', 'h-34 w-12', 'h-48 w-20', 'h-28 w-10',
];

const FloatingMetric: React.FC<{ metric: typeof metrics[number] }> = ({ metric }) => (
  <motion.div
    className="absolute z-20 rounded-2xl border border-cyan-300/30 bg-slate-950/55 px-4 py-3 text-white shadow-2xl shadow-cyan-500/20 backdrop-blur-md"
    style={{ left: metric.x, top: metric.y }}
    initial={{ opacity: 0, y: 18, scale: 0.9 }}
    animate={{ opacity: [0.75, 1, 0.8], y: [0, -16, 0], scale: [1, 1.04, 1] }}
    transition={{ duration: 5.5, delay: metric.delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200">{metric.label}</p>
    <p className="mt-1 text-lg font-black text-white">{metric.value}</p>
  </motion.div>
);

const BusinessNode: React.FC<{ node: typeof businessNodes[number] }> = ({ node }) => (
  <motion.div
    className="absolute z-20 flex flex-col items-center"
    style={{ left: node.x, top: node.y }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [0, -10, 0] }}
    transition={{ opacity: { delay: node.delay }, y: { duration: 4, delay: node.delay, repeat: Infinity, ease: 'easeInOut' } }}
  >
    <motion.div
      className={cn('grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-2xl shadow-2xl ring-2 ring-white/30', node.color)}
      animate={{ boxShadow: ['0 0 28px rgba(16,185,129,.35)', '0 0 55px rgba(34,211,238,.6)', '0 0 28px rgba(16,185,129,.35)'] }}
      transition={{ duration: 3.5, delay: node.delay, repeat: Infinity }}
    >
      {node.icon}
    </motion.div>
    <div className="mt-2 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1 text-xs font-bold text-cyan-50 backdrop-blur">
      {node.label}
    </div>
  </motion.div>
);

const PeopleSilhouette: React.FC<{ item: typeof silhouettes[number] }> = ({ item }) => (
  <motion.div
    className="absolute bottom-14 z-20 flex items-end gap-1 opacity-80"
    style={{ left: item.x }}
    animate={{ x: [-20, 36, -20] }}
    transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
    aria-hidden="true"
  >
    <div className="h-5 w-5 rounded-full bg-cyan-100/90" />
    <div className="h-11 w-6 rounded-t-full bg-gradient-to-b from-cyan-100/90 to-emerald-300/70" />
  </motion.div>
);

const PremiumLandingHero: React.FC = () => {
  return (
    <section
      className="relative min-h-[640px] overflow-hidden bg-[#020617] text-white lg:min-h-screen"
      aria-label="Animated BizGuard business intelligence hero"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(16,185,129,.34),transparent_30%),radial-gradient(circle_at_76%_24%,rgba(34,211,238,.28),transparent_31%),linear-gradient(135deg,#020617_0%,#0f172a_44%,#042f2e_100%)]" />

      {/* Light rays */}
      <motion.div
        className="absolute -left-40 top-0 h-[140%] w-72 rotate-12 bg-gradient-to-b from-cyan-300/0 via-cyan-300/20 to-emerald-300/0 blur-2xl"
        animate={{ x: ['-10%', '160%'], opacity: [0.15, 0.65, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-10 top-0 h-[120%] w-60 -rotate-12 bg-gradient-to-b from-amber-200/0 via-amber-200/18 to-cyan-200/0 blur-2xl"
        animate={{ x: ['20%', '-120%'], opacity: [0.1, 0.55, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* City skyline */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center gap-2 opacity-70"
        animate={{ x: [0, -28, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        {skyline.map((size, index) => (
          <div key={index} className={cn('rounded-t-lg border border-cyan-300/10 bg-gradient-to-t from-slate-950 via-slate-800 to-cyan-900/80 shadow-xl', size)}>
            <div className="grid grid-cols-2 gap-1 p-2 opacity-80">
              {Array.from({ length: 8 }, (_, dot) => <span key={dot} className="h-1 rounded-full bg-cyan-200/50" />)}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Connection lines */}
      <svg className="absolute inset-0 z-10 h-full w-full opacity-80" aria-hidden="true">
        <defs>
          <linearGradient id="bizguard-line" x1="0" x2="1">
            <stop offset="0" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f59e0b" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.path
          d="M120 420 C250 320 360 480 510 350 S780 450 930 280 S1120 330 1260 220"
          fill="none"
          stroke="url(#bizguard-line)"
          strokeWidth="3"
          strokeDasharray="10 16"
          animate={{ strokeDashoffset: [0, -220] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M150 210 C330 160 420 250 610 210 S850 120 1100 180"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeDasharray="6 14"
          animate={{ strokeDashoffset: [0, -180] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Data particles */}
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute z-10 h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(34,211,238,.9)]"
          style={{ left: particle.x, top: particle.y }}
          animate={{ y: [0, -46, 0], x: [0, 18, -10, 0], opacity: [0.15, 1, 0.2], scale: [0.8, 1.8, 0.8] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      ))}

      {/* AI pulse core */}
      <div className="absolute left-1/2 top-[45%] z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/40"
            animate={{ width: [120, 390], height: [120, 390], opacity: [0.55, 0] }}
            transition={{ duration: 3.8, delay: ring * 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          className="relative grid h-28 w-28 place-items-center rounded-[2rem] border border-cyan-300/40 bg-slate-950/60 shadow-2xl shadow-cyan-500/40 backdrop-blur-xl"
          animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BrainCircuit className="h-12 w-12 text-cyan-200" />
        </motion.div>
      </div>

      {businessNodes.map((node) => <BusinessNode key={node.label} node={node} />)}
      {metrics.map((metric) => <FloatingMetric key={metric.label} metric={metric} />)}
      {silhouettes.map((item) => <PeopleSilhouette key={item.x} item={item} />)}

      {/* Drone */}
      <motion.div
        className="absolute right-[10%] top-[18%] z-20 text-4xl drop-shadow-[0_0_22px_rgba(34,211,238,.9)]"
        animate={{ x: [0, -130, 60, 0], y: [0, 38, -18, 0], rotate: [0, -8, 8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Animated drone representing logistics intelligence"
      >
        🚁
      </motion.div>

      <div className="relative z-30 flex min-h-[640px] items-center px-6 py-20 sm:px-10 lg:min-h-screen lg:px-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-xl shadow-cyan-500/10 backdrop-blur"
          >
            <Sparkles className="h-4 w-4" />
            Africa's intelligent business operating system
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="mt-8 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-white drop-shadow-2xl sm:text-6xl xl:text-7xl"
          >
            AI-Powered Business Intelligence for African SMEs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.24 }}
            className="mt-6 max-w-2xl text-lg font-medium leading-8 text-cyan-50/90 sm:text-xl"
          >
            Predict demand. Track inventory. Understand risk. Grow with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.36 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <a href="#auth-panel" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-4 text-base font-black text-slate-950 shadow-2xl shadow-cyan-500/30 transition hover:scale-[1.02]">
              Get Started <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-black text-white shadow-2xl backdrop-blur transition hover:bg-white/15">
              View Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.48 }}
            className="mt-10 grid max-w-2xl grid-cols-3 gap-3"
          >
            {[
              { icon: BarChart3, label: 'Demand signals' },
              { icon: Boxes, label: 'Live stock control' },
              { icon: ShieldCheck, label: 'Risk intelligence' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/15 bg-slate-950/35 p-4 backdrop-blur-md">
                <item.icon className="mb-3 h-6 w-6 text-cyan-200" />
                <p className="text-sm font-bold text-white/90">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-950/10 via-transparent to-slate-950/35 pointer-events-none" />
    </section>
  );
};

export default PremiumLandingHero;
