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
      rollNumber: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required]
    });
    this.getAllPersons();
  }

  getAllPersons() {
    this.http.get<any[]>('https://springrestapi-production.up.railway.app/persons')
      .subscribe(data => {
        this.formData = data;
        this.filteredData = data;
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
    if (value !== '') {
      this.http.get<any[]>(`https://springrestapi-production.up.railway.app/persons?search=${value}`)
        .subscribe(data => {
          this.filteredData = data;
        });
    } else {
      this.filteredData = this.formData;
    }
  }
}
