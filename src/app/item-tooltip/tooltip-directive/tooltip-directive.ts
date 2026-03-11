import {
  Directive, Input, HostListener,
  ComponentRef, OnDestroy, ApplicationRef,
  createComponent, EnvironmentInjector
} from '@angular/core';
import { Item } from '../../models/item-model';
import { ItemTooltipComponent } from '../tooltip-component/tooltip-component';

@Directive({
  selector: '[itemTooltip]',
  standalone: false
})
export class ItemTooltipDirective implements OnDestroy {
  @Input('itemTooltip') item!: Item;

  // ── One pinned tooltip across ALL directive instances ────────
  private static pinnedRef: ComponentRef<ItemTooltipComponent> | null = null;

  private hoverRef: ComponentRef<ItemTooltipComponent> | null = null;
  private hideTimer: any;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) { }

  // ── Hover: show floating tooltip (only when nothing is pinned) ──
  @HostListener('mouseenter', ['$event'])
  onEnter(event: MouseEvent) {
    if (ItemTooltipDirective.pinnedRef) return;
    clearTimeout(this.hideTimer);
    if (!this.hoverRef) this.hoverRef = this.mountToBody();
    this.applyItem(this.hoverRef, this.item);
    this.hoverRef.instance.visible = true;
    this.hoverRef.instance.pinned = false;
    this.updatePosition(this.hoverRef, event);
    this.hoverRef.changeDetectorRef.detectChanges();
  }

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent) {
    if (this.hoverRef && !this.hoverRef.instance.pinned) {
      this.updatePosition(this.hoverRef, event);
      this.hoverRef.changeDetectorRef.detectChanges();
    }
  }

  @HostListener('mouseleave')
  onLeave() {
    this.hideTimer = setTimeout(() => this.destroyHover(), 80);
  }

  // ── Click: pin tooltip (one at a time) ──────────────────────
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // If this row's tooltip is already pinned -> unpin and close
    if (ItemTooltipDirective.pinnedRef && this.hoverRef === ItemTooltipDirective.pinnedRef) {
      this.closePinned();
      return;
    }

    // Close any other pinned tooltip first
    this.closePinned();

    // Destroy hover so we create a fresh pinned one
    this.destroyHover();

    const ref = this.mountToBody();
    this.applyItem(ref, this.item);
    ref.instance.visible = true;
    ref.instance.pinned = true;
    this.updatePosition(ref, event, true);
    ref.changeDetectorRef.detectChanges();

    // Listen for the X close button
    ref.instance.closed.subscribe(() => {
      this.destroyRef(ref);
      if (ItemTooltipDirective.pinnedRef === ref) {
        ItemTooltipDirective.pinnedRef = null;
      }
      this.hoverRef = null;
    });

    ItemTooltipDirective.pinnedRef = ref;
    this.hoverRef = ref;
  }

  // ── Helpers ──────────────────────────────────────────────────

  /** Mount directly on document.body to avoid click-bubbling through the table row */
  private mountToBody(): ComponentRef<ItemTooltipComponent> {
    const ref = createComponent(ItemTooltipComponent, {
      environmentInjector: this.injector
    });
    this.appRef.attachView(ref.hostView);
    document.body.appendChild(ref.location.nativeElement);
    return ref;
  }

  private applyItem(ref: ComponentRef<ItemTooltipComponent>, item: Item) {
    const prev = ref.instance.item;
    ref.instance.item = item;
    if (prev !== item) {
      ref.instance.ngOnChanges({
        item: {
          currentValue: item,
          previousValue: prev,
          firstChange: !prev,
          isFirstChange: () => !prev
        }
      });
    }
  }

  private updatePosition(
    ref: ComponentRef<ItemTooltipComponent>,
    event: MouseEvent,
    pinned = false
  ) {
    const offset = 16;
    const tooltipWidth = 380;
    const tooltipHeight = pinned ? 460 : 300;

    let x = event.clientX + offset;
    let y = event.clientY + offset;

    if (x + tooltipWidth > window.innerWidth - 8) x = event.clientX - tooltipWidth - offset;
    if (y + tooltipHeight > window.innerHeight - 8) y = event.clientY - tooltipHeight - offset;

    ref.instance.x = x;
    ref.instance.y = y;
  }

  private closePinned() {
    if (ItemTooltipDirective.pinnedRef) {
      this.destroyRef(ItemTooltipDirective.pinnedRef);
      ItemTooltipDirective.pinnedRef = null;
      this.hoverRef = null;
    }
  }

  private destroyHover() {
    if (this.hoverRef && this.hoverRef !== ItemTooltipDirective.pinnedRef) {
      this.destroyRef(this.hoverRef);
    }
    this.hoverRef = null;
  }

  private destroyRef(ref: ComponentRef<ItemTooltipComponent>) {
    try {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
    } catch (_) { /* already destroyed */ }
  }

  ngOnDestroy() {
    clearTimeout(this.hideTimer);
    this.destroyHover();
    if (this.hoverRef && ItemTooltipDirective.pinnedRef === this.hoverRef) {
      this.closePinned();
    }
  }
}