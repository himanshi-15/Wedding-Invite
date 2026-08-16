

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { MusicPlayerComponent } from './shared/music-player/music-player.component';
import { NamesComponent } from './pages/names/names.component';
import { InviteComponent } from './pages/invite/invite.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { RsvpComponent } from './pages/rsvp/rsvp.component';
import { ClosingComponent } from './pages/closing/closing.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MusicPlayerComponent, NamesComponent, InviteComponent, TimelineComponent, RsvpComponent, ClosingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invitationSite';
  showRsvp = environment.RSVP;

}



