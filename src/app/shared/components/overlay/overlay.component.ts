import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { OverlayService } from '../../services/overlay.service';
import { MatCardModule } from '@angular/material/card'
import { CommonModule } from '@angular/common';
@Component({
  selector: 'overlay',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    OverlayModule,
    PortalModule,
  ],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  @Input() connectedTo: any;
  @Input() text!: string;
  @Input() get id(): number {
    return this._id;
  }
  set id(id: number) {
    if (typeof id === 'string') {
      this._id = parseInt(id);
    } else {
      this._id = id;
    }
  }
  private _id!: number;
  @Output() closed = new EventEmitter<any>();
  @ViewChild(CdkPortal) portal!: ElementRef;
  overlayRef!: OverlayRef;
  private nativeElement: any;

  constructor(
    private overlay: Overlay,
    private renderer: Renderer2,
    private overlayService: OverlayService
  ) {}

  ngOnInit() {
    this.overlayService.registerOverlay(this);
    console.log(this.connectedTo);
    if (this.connectedTo.getBoundingClientRect) {
      this.nativeElement = this.connectedTo;
    } else {
      this.nativeElement = this.connectedTo._elementRef.nativeElement;
    }
  }

  public showOverlay() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.nativeElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -10,
        },
        {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 10,
        },
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 10,
        },
      ])
      .withGrowAfterOpen();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'my-backdrop',
    });
    this.overlayRef = overlayRef;
    overlayRef.detachments().subscribe(() => {
      this.renderer.removeClass(this.nativeElement, 'elevate');
      this.renderer.removeAttribute(this.nativeElement, 'id');
    });
    overlayRef.attach(this.portal);
    this.renderer.addClass(this.nativeElement, 'elevate');
    this.renderer.setAttribute(this.nativeElement, 'id', 'onboarding-active');
    overlayRef.backdropClick().subscribe(() => this.hideOverlay());
  }

  public hideOverlay() {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayService.wasClosed(this._id);
      this.overlayRef.dispose();
      this.closed.emit();
    }
  }

  ngOnDestroy() {
    this.hideOverlay();
    this.overlayService.destroyOverlay(this);
  }
}
