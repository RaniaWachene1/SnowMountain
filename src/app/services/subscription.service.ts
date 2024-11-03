import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private apiUrl = '/api/piste';

  constructor(private http: HttpClient) { }

  addSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/add`, subscription);
  }

  getSubscriptionById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/get/${id}`);
  }

  getSubscriptionsByType(type: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/all/${type}`);
  }

  updateSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/update`, subscription);
  }

  getSubscriptionsByDates(date1: string, date2: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/all/${date1}/${date2}`);
  }
}
