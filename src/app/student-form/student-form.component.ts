import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  public myForm!: FormGroup;
  formData: any[] = [];
  searchTerm: string = '';
  filteredData: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      rollNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{7}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required]
    });
    this.getAllPersons();
  }

  getAllPersons() {
    this.http.get<any[]>('https://springrestapi-production.up.railway.app/persons')
      .subscribe(data => {
        this.formData = data.map(item => ({
          name: item.name,
          rollNumber: item.rollNumber,
          email: item.email,
          phone: item.phone,
          gender: item.gender
        }));
        this.filteredData = this.formData;
      });
  }

  getPerson(rollNo: string) {
    return this.http.get<any>(`https://springrestapi-production.up.railway.app/persons/${rollNo}`);
  }

  insertPerson(personData: any) {
    return this.http.post<any>('https://springrestapi-production.up.railway.app/persons', personData);
  }

  updatePerson(personData: any) {
    return this.http.put<any>('https://springrestapi-production.up.railway.app/persons', personData);
  }

  deletePerson(rollNo: string) {
    return this.http.delete<any>(`https://springrestapi-production.up.railway.app/persons/${rollNo}`);
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.insertPerson(this.myForm.value).subscribe(data => {
        this.formData.push(data);
        this.myForm.reset();
        this.filteredData = this.formData;
      });
    }
  }

  onSearch(value: string) {
    if (value && value.trim() !== '') {
      this.filteredData = this.formData.filter(item => {
        return (
          (item.name && item.name.toLowerCase().includes(value.toLowerCase())) ||
          (item.rollNumber && item.rollNumber.toLowerCase().includes(value.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase())) ||
          (item.phone && item.phone.toLowerCase().includes(value.toLowerCase())) ||
          (item.gender && item.gender.toLowerCase().includes(value.toLowerCase()))
        );
      });
    } else {
      this.filteredData = this.formData;
    }
  }
}