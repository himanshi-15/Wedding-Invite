

import { Component } from '@angular/core';
import { ScratchCardComponent } from '../../shared/scratch-card/scratch-card.component';

/**
 * Page 2 — "You're Invited". Bg-2.jpg backdrop with the invitation copy and
 * an interactive scratch card that reveals the wedding date.
 */
@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [ScratchCardComponent],
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.css'
})
export class InviteComponent {}


