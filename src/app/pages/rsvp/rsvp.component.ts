

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

type Attendance = 'yes' | 'no' | null;

/**
 * Page 4 — "RSVP". Bg-5 backdrop with a name field, attendance toggle, a
 * guest-count dropdown (shown only when attending), and a venue card with a
 * Google Maps link.
 */
@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rsvp.component.html',
  styleUrl: './rsvp.component.css'
})
export class RsvpComponent {
  readonly guestOptions = ['1', '2', '3', '4', '5+'];

  guestName = '';
  attending: Attendance = null;
  guestCount = '';
  showGuestOptions = false;
  submitting = false;
  submitted = false;
  submitError = false;

  readonly mapsUrl = 'https://maps.app.goo.gl/fg3ftPUiRntGnk8R8';

  toggleGuestOptions(): void {
    this.showGuestOptions = !this.showGuestOptions;
  }

  selectGuestCount(option: string): void {
    this.guestCount = option;
    this.showGuestOptions = false;
  }

  canSubmit(): boolean {
    if (!this.guestName.trim() || !this.attending) {
      return false;
    }
    if (this.attending === 'yes' && !this.guestCount) {
      return false;
    }
    return true;
  }

  async onSubmit(): Promise<void> {
    if (!this.canSubmit() || this.submitting) {
      return;
    }

    this.submitting = true;
    this.submitError = false;
    this.showGuestOptions = false;

    const payload = JSON.stringify({
      name: this.guestName.trim(),
      attendance: this.attending === 'yes' ? 'Yes' : 'No',
      guestCount: this.attending === 'yes' ? this.guestCount : ''
    });

    try {
      if (!environment.googleScriptUrl) {
        throw new Error('Missing Google Script URL');
      }
      // Apps Script's doPost() parses e.postData.contents as JSON, so the
      // body must be a JSON string. Sending it as a plain string (not via
      // the Content-Type: application/json header, which would trigger a
      // CORS preflight that Apps Script doesn't support) keeps this a
      // "simple" request compatible with mode: 'no-cors'. That also means
      // the response is opaque — we can't confirm success from it, so we
      // treat a resolved fetch (no network/DNS failure) as success.
      await fetch(environment.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      });
      this.submitted = true;
    } catch {
      this.submitError = true;
    } finally {
      this.submitting = false;
    }
  }
}


