import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';


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
  sortColumn: string = '';
  sortDirection: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      rollNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['', Validators.required]
    });
    this.getAllPersons();
  }

  getAllPersons() {
    this.http.get<any[]>('https://springrestapi-production.up.railway.app/persons')
      .subscribe(data => {
        this.formData = data.map(item => ({
          name: item.name,
          rollNo: item.rollNo,
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
    return this.http.post<any>('https://springrestapi-production.up.railway.app/persons/', personData);
  }
  
  updatePerson(personData: any) {
    const rollNo = personData.rollNo;
    return this.http.put<any>(`https://springrestapi-production.up.railway.app/persons/${rollNo}`, personData);
  }
  
  deletePerson(rollNo: string) {
    return this.http.delete<any>(`https://springrestapi-production.up.railway.app/persons/${rollNo}`);
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.insertPerson(this.myForm.value).subscribe(data => {
        this.formData.push(this.myForm.value); // push the form data instead of the response data
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
          (item.rollNo && item.rollNo.toString().includes(value))||
          (item.email && item.email.toLowerCase().includes(value.toLowerCase())) ||
          (item.phone && item.phone.toLowerCase().includes(value.toLowerCase())) ||
          (item.gender && item.gender.toLowerCase().includes(value.toLowerCase()))
        );
      });
    } else {
      this.filteredData = this.formData;
    }
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.filteredData = this.formData.slice(startIndex, endIndex);
  }

  onSort(column: string) {
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredData = this.filteredData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }
}