import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  getUser(githubUsername: string): Observable<any> {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`);
  }

  getRepos(githubUsername: string): Observable<any[]> {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}/repos`)
      .pipe(
        map((data: any) => {
          return data;
        }),
        catchError((error) => {
          console.error('Error fetching repositories', error);
          return throwError('Unable to fetch repositories. Please try again.');
        })
      );
  }
  getRepoLanguages(githubUsername: string, repoName: string): Observable<any> {
    return this.httpClient.get(`https://api.github.com/repos/${githubUsername}/${repoName}/languages`);
  }
}
