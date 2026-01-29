import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
  imports: [CommonModule, TooltipModule]
})
export class ButtonComponent {
  @Input() design: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info' | 'no-border-blue' | 'no-border-black' | 'blue-light' = 'primary';
  @Input() size: 'medium' | 'small' | 'large' = 'medium';
  @Input() tooltip: string = '';
  @Input() fullWidth: boolean = false;
  @Input() disabled: boolean = false;
  @Input() iconRight: string | null = null;
  @Input() iconLeft: string | null = null;
  @Input() loading: boolean = false;
  @Output() onClick: EventEmitter<Event> = new EventEmitter<Event>();

  handleClick() {
    if (!this.disabled && !this.loading) {
      this.onClick.emit();
    }
  }
}
