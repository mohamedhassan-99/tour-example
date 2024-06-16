import { OverlayService } from './shared/services/overlay.service';
import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayComponent } from './shared/components/overlay/overlay.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, OverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  /**
   *
   */
  constructor(private OverlayService: OverlayService) {}
  ngAfterViewInit(): void {
    this.OverlayService.showOverlay(1);
  }
  title = 'tour-example';
}
