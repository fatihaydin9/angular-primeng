import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../../types';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    RatingModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.scss'],
})
export class EditPopupComponent implements OnInit {
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() header!: string;
  @Input() product: Product = { name: '', image: '', price: '', rating: 0 };
  @Output() confirm = new EventEmitter<Product>();

  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, this.specialCharacterValidator()]],
      image: [''],
      price: ['', [Validators.required]],
      rating: [0],
    });
  }

  ngOnChanges() {
    if (this.productForm) {
      this.productForm.patchValue(this.product);
      this.cdr.markForCheck(); // Formun güncellenmesini sağlamak için
    }
  }

  specialCharacterValidator(): ValidatorFn {
    return (
      control: AbstractControl
    ): { hasSpecialCharacter: boolean } | null => {
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        control.value
      );
      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  onConfirm() {
    if (this.productForm.valid) {
      this.confirm.emit(this.productForm.value);
      this.display = false;
      this.displayChange.emit(this.display);
    }
  }

  onCancel() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
