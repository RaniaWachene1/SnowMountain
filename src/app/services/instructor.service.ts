import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor } from '../models/instructor.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private apiUrl = '/api/piste';

  constructor(private http: HttpClient) { }

  addInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.post<Instructor>(`${this.apiUrl}/add`, instructor);
  }

  addInstructorAndAssignToCourse(instructor: Instructor, courseId: number): Observable<Instructor> {
    return this.http.put<Instructor>(`${this.apiUrl}/addAndAssignToCourse/${courseId}`, instructor);
  }

  getAllInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.apiUrl}/all`);
  }

  updateInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.put<Instructor>(`${this.apiUrl}/update`, instructor);
  }

  getInstructorById(id: number): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.apiUrl}/get/${id}`);
  }
}
