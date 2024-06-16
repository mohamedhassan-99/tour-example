import { Injectable } from '@angular/core';
import { OverlayComponent } from '../components/overlay/overlay.component';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  constructor() {}

  private overlays: Map<number, OverlayComponent> = new Map();
  private latestShownOverlayId = -1;

  public showOverlay(id: number) {
    console.log(this.overlays);
    const overlay = this.overlays.get(id);
    console.log('found' + overlay);
    if (overlay) {
      overlay.showOverlay();
    }
  }

  public registerOverlay(overlay: OverlayComponent) {
    console.log(overlay);
    this.overlays.set(overlay.id, overlay);
  }

  public destroyOverlay(overlay: OverlayComponent) {
    this.overlays.delete(overlay.id);
  }

  public wasClosed(overlayId: number) {
    this.latestShownOverlayId = overlayId;
    const overlay = this.overlays.get(this.latestShownOverlayId + 1);
    if (overlay) {
      setTimeout(() => overlay.showOverlay(), 500);
    }
  }
}
