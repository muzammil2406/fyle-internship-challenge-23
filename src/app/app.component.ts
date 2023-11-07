import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  username: string = 'johnpapa';
  userData: any;
  repos: any[] = [];
  repoLanguages: any = {};
  pageSize: number = 10;
  currentPage: number = 1;
  pagedRepos: any[] = [];
  userNotFound: boolean = false;
  isLoading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.userNotFound = false;
    this.apiService.getUser(this.username).subscribe(
      (userData: any) => {
        this.userData = userData;
        this.username = userData.login;

        this.apiService.getRepos(this.username).subscribe(
          (repos: any[]) => {
            this.repos = repos;
            this.updatePagedRepos();
          },
          (error) => {
            this.repos = [];
            this.updatePagedRepos();
          }
        );
      },
      (error) => {
        this.userData = null;
        this.repos = [];
        this.updatePagedRepos();
        this.userNotFound = true;
      }
    );
    this.isLoading = false;
  }


  onPageChange(event: any) {
    this.isLoading =true;
    this.currentPage = event.pageIndex + 1;
    this.updatePagedRepos();
    this.isLoading= false;
  }

  updatePagedRepos() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedRepos = this.repos.slice(startIndex, endIndex);

    for (const repo of this.pagedRepos){
        this.apiService.getRepoLanguages(this.username,repo.name).subscribe((languages: any)=>{
            this.repoLanguages[repo.name] = Object.keys(languages);
        })
    }
  }
}
