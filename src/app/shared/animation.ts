

import { animate, style, transition, trigger } from '@angular/animations';

/** Gentle fade + rise-in animation used when a page enters view. */
export const fadeSlideIn = trigger('fadeSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(16px)' }),
    animate('600ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);


