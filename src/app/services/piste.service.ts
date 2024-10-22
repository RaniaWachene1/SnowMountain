import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Piste } from '../models/piste.model';

@Injectable({
  providedIn: 'root'
})
export class PisteService {

  private apiUrl = 'http://192.168.80.148:8089/api/piste';  // Updated with context path /api and port 8089

  constructor(private http: HttpClient) { }

  addPiste(piste: Piste): Observable<Piste> {
    return this.http.post<Piste>(`${this.apiUrl}/add`, piste);
  }

  getAllPistes(): Observable<Piste[]> {
    return this.http.get<Piste[]>(`${this.apiUrl}/all`);
  }

  getPisteById(id: number): Observable<Piste> {
    return this.http.get<Piste>(`${this.apiUrl}/get/${id}`);
  }

  deletePiste(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
