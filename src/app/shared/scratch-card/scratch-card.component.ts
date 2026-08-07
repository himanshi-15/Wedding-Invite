

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, afterNextRender } from '@angular/core';

/**
 * Interactive scratch-off card. A static `ScratchFrame.png` gold ring sits on
 * top (decorative, non-interactive); the canvas underneath is clipped to the
 * frame's inner circle and is painted with a CSS/canvas-drawn metallic
 * "scratch" texture (gradient + random scuff lines + label) — no bitmap
 * asset required. Pointer drags erase the canvas (destination-out
 * compositing), revealing the stacked day / month / year date sitting
 * underneath, inside the frame's hole. Once enough of the canvas has been
 * cleared, the rest fades away automatically.
 */
@Component({
  selector: 'app-scratch-card',
  standalone: true,
  templateUrl: './scratch-card.component.html',
  styleUrl: './scratch-card.component.css'
})
export class ScratchCardComponent {
  @Input() revealDay = '';
  @Input() revealMonth = '';
  @Input() revealYear = '';
  @Output() revealed = new EventEmitter<void>();

  @ViewChild('canvasEl') private canvasRef?: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private isScratching = false;
  private isRevealed = false;
  private scratchCount = 0;

  private readonly brushRadius = 22;
  private readonly revealThreshold = 0.55;
  private readonly checkEveryNStrokes = 6;

  constructor() {
    afterNextRender(() => this.initCanvas());
  }

  onPointerDown(event: PointerEvent): void {
    if (this.isRevealed) return;
    this.isScratching = true;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    this.scratchAt(event);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isScratching || this.isRevealed) return;
    this.scratchAt(event);
  }

  onPointerUp(): void {
    this.isScratching = false;
  }

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const size = canvas.clientWidth || 200;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    this.ctx = ctx;

    this.paintScratchTexture(ctx, size);
  }

  /** Draws a metallic silver "scratch card" surface entirely with canvas
   * primitives — a radial gradient base, randomized scuff lines, and the
   * "Scratch to Reveal" label — so no bitmap asset is required. */
  private paintScratchTexture(ctx: CanvasRenderingContext2D, size: number): void {
    const gradient = ctx.createRadialGradient(
      size * 0.35,
      size * 0.3,
      size * 0.05,
      size * 0.5,
      size * 0.5,
      size * 0.75
    );
    gradient.addColorStop(0, '#e8e8ea');
    gradient.addColorStop(0.5, '#c9cad0');
    gradient.addColorStop(1, '#9b9ca3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Randomized scuff lines for a scratched-metal look.
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const x1 = Math.random() * size;
      const y1 = Math.random() * size;
      const len = 6 + Math.random() * 18;
      const angle = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(60, 60, 65, 0.25)';
    for (let i = 0; i < 40; i++) {
      const x1 = Math.random() * size;
      const y1 = Math.random() * size;
      const len = 6 + Math.random() * 14;
      const angle = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len);
      ctx.stroke();
    }

    ctx.fillStyle = '#2c2c30';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${size * 0.13}px 'Cormorant Garamond', serif`;
    ctx.fillText('Scratch', size / 2, size / 2 - size * 0.09);
    ctx.fillText('to Reveal', size / 2, size / 2 + size * 0.09);
  }

  private scratchAt(event: PointerEvent): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushRadius, 0, Math.PI * 2);
    this.ctx.fill();

    this.scratchCount++;
    if (this.scratchCount % this.checkEveryNStrokes === 0) {
      this.checkRevealProgress(canvas);
    }
  }

  private checkRevealProgress(canvas: HTMLCanvasElement): void {
    if (!this.ctx) return;

    const data = this.ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    let total = 0;
    // Sample every 16th pixel (alpha channel) to keep this cheap.
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] < 40) transparent++;
    }

    if (total > 0 && transparent / total >= this.revealThreshold) {
      this.revealCard();
    }
  }

  private revealCard(): void {
    this.isRevealed = true;
    this.canvasRef?.nativeElement.classList.add('is-cleared');
    this.revealed.emit();
  }
}


