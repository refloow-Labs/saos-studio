import { useId } from 'react'

interface Props {
  className?: string
  /**
   * On-screen strength of the main ridgeline. The foothill and terrain layers
   * are drawn at fractions of it, so the ridge always reads first.
   */
  opacity?: number
  /** Stroke colour. Defaults to `currentColor`, so the parent's `text-*` class tints it. */
  stroke?: string
}

/**
 * The front silhouette of Mount Saos (Φεγγάρι), Samothraki, as line art.
 *
 * Hand-authored from a photograph of the mountain seen from the sea — the shape
 * only. No part of the photo ships; there is no raster asset behind this.
 *
 * What makes the profile recognisable is its asymmetry and its mass: a long
 * shallow shore on the left that steepens sharply into a serrated crest right
 * of centre, then a steeper fall to a low right-hand shoulder running back down
 * to the water. Drawn as an elegant silhouette, not a contour survey.
 *
 * The 1440×620 viewBox (≈2.32:1) is a deliberate choice. An earlier, much wider
 * box made the flanks so shallow that at hero scale they read as two stray
 * diagonal lines rather than a mountain. Consumers should size the box to that
 * same ratio — `h-[43vw]` is the exact match — so `slice` scales rather than
 * crops; a box far from this ratio will crop the summit or the flanks.
 *
 * `xMidYMax slice` then does the responsive work: on a narrow viewport the box
 * is proportionally taller, so the drawing crops inward from the sides to the
 * summit — a natural crop instead of a squashed mountain — and because the
 * parent is absolutely positioned inside an `overflow-hidden` section it can
 * never widen the document.
 */
export default function MountSaos({
  className = '',
  opacity = 0.18,
  stroke = 'currentColor',
}: Props) {
  // React's useId emits colons, which are legal in an id but awkward inside a
  // url(#...) reference. Stripped so the mask resolves in every engine.
  const maskId = `saos-fade-${useId().replace(/:/g, '')}`

  return (
    <svg
      viewBox="0 0 1440 620"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      <defs>
        {/*
          Fades the drawing out toward its base so the ridge dissolves into the
          ground instead of ending on a hard cut. The summit sits ~15% down the
          viewBox, so full strength starts just above it.
        */}
        <linearGradient id={`${maskId}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="18%" stopColor="#fff" stopOpacity="1" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId}>
          <rect x="0" y="0" width="1440" height="620" fill={`url(#${maskId}-grad)`} />
        </mask>
      </defs>

      <g
        mask={`url(#${maskId})`}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 1. The main ridgeline — the most visible line in the drawing. The
               straight segments through the crest are the serrated summit. */}
        <path
          d="M0 585
             C 120 578, 240 566, 350 540
             C 450 516, 530 476, 600 420
             C 655 376, 700 320, 740 262
             C 762 230, 778 196, 792 168
             L 806 140 L 818 158 L 832 118 L 844 140
             L 860 96 L 874 126 L 888 108 L 902 148
             C 920 190, 942 232, 968 272
             C 1000 320, 1036 360, 1080 398
             C 1130 440, 1180 470, 1240 498
             C 1300 526, 1370 552, 1440 570"
          strokeWidth="2"
          strokeOpacity="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* 2. A softer foothill ridge crossing in front, for depth. */}
        <path
          d="M0 620
             C 100 606, 200 588, 310 566
             C 420 544, 500 522, 590 508
             C 680 494, 750 490, 830 496
             C 920 503, 990 518, 1080 540
             C 1180 564, 1290 588, 1440 606"
          strokeWidth="1.4"
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* 3. A handful of gullies falling from the crest. Summit only — spread
               across the whole flank they stop being terrain and become hatching. */}
        <g strokeWidth="1" strokeOpacity="0.3">
          <path d="M860 108 C 866 170, 858 230, 838 292" vectorEffect="non-scaling-stroke" />
          <path d="M832 130 C 824 180, 806 232, 780 286" vectorEffect="non-scaling-stroke" />
          <path d="M888 122 C 900 176, 918 228, 944 278" vectorEffect="non-scaling-stroke" />
          <path d="M806 152 C 792 196, 770 240, 742 284" vectorEffect="non-scaling-stroke" />
          <path d="M916 170 C 934 214, 954 256, 980 296" vectorEffect="non-scaling-stroke" />
        </g>
      </g>
    </svg>
  )
}
