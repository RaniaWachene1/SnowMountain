import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skier } from '../models/skier.model';

@Injectable({
  providedIn: 'root'
})
export class SkierService {

  private apiUrl = '/api/piste';  // Updated with context path /api and port 8089

  constructor(private http: HttpClient) { }

  addSkier(skier: Skier): Observable<Skier> {
    return this.http.post<Skier>(`${this.apiUrl}/add`, skier);
  }

  addSkierAndAssignToCourse(skier: Skier, courseId: number): Observable<Skier> {
    return this.http.post<Skier>(`${this.apiUrl}/addAndAssign/${courseId}`, skier);
  }

  assignToSubscription(skierId: number, subId: number): Observable<Skier> {
    return this.http.put<Skier>(`${this.apiUrl}/assignToSub/${skierId}/${subId}`, {});
  }

  assignToPiste(skierId: number, pisteId: number): Observable<Skier> {
    return this.http.put<Skier>(`${this.apiUrl}/assignToPiste/${skierId}/${pisteId}`, {});
  }

  getAllSkiers(): Observable<Skier[]> {
    return this.http.get<Skier[]>(`${this.apiUrl}/all`);
  }

  getSkierById(id: number): Observable<Skier> {
    return this.http.get<Skier>(`${this.apiUrl}/get/${id}`);
  }

  deleteSkier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
