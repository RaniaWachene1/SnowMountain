import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = '/api/piste';

  constructor(private http: HttpClient) { }

  addAndAssignToSkier(registration: Registration, skierId: number): Observable<Registration> {
    return this.http.put<Registration>(`${this.apiUrl}/addAndAssignToSkier/${skierId}`, registration);
  }

  assignRegistrationToCourse(regId: number, courseId: number): Observable<Registration> {
    return this.http.put<Registration>(`${this.apiUrl}/assignToCourse/${regId}/${courseId}`, {});
  }

  addAndAssignToSkierAndCourse(registration: Registration, skierId: number, courseId: number): Observable<Registration> {
    return this.http.put<Registration>(`${this.apiUrl}/addAndAssignToSkierAndCourse/${skierId}/${courseId}`, registration);
  }

  getNumWeeksByInstructorAndSupport(instructorId: number, support: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/numWeeks/${instructorId}/${support}`);
  }
}
