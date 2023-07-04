import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  public myForm!: FormGroup; // Use the non-null assertion operator to tell TypeScript that myForm is not null
  formData: any[] = [];
  searchTerm: string = '';
  filteredData: any[] = [];
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      rollNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required]
    });
    this.filteredData = this.formData;
  }

  // Add a null check for myForm in the onSubmit method
  onSubmit() {
    if (this.myForm) {
      this.formData.push(this.myForm.value);
      this.myForm.reset();
    }
  }
  onSearch(value: string) {
    if (value !== '') {
      this.filteredData = this.formData.filter(data =>
        data.name.toLowerCase().includes(value.toLowerCase()) ||
        data.rollNumber.toLowerCase().includes(value.toLowerCase()) ||
        data.email.toLowerCase().includes(value.toLowerCase()) ||
        data.phone.toLowerCase().includes(value.toLowerCase()) ||
        data.gender.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredData = this.formData;
    }
  }
}