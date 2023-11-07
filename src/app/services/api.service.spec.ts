import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockReposData, mockRepoLanguagesData } from './mock-data';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data', () => {
    const username = 'johnpapa';

    service.getUser(username).subscribe(user => {
      expect(user.login).toEqual(username);
    });

    const req = httpTestingController.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toEqual('GET');
    req.flush({ login: username });
  });
  it('should handle errors when fetching user data', () => {
    const username = 'johnpapa';
  
    service.getUser(username).subscribe(
      () => {
        fail('Expected an error, but received data');
      },
      error => {
        expect(error).toBeTruthy();
      }
    );
  
    const req = httpTestingController.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('network error'), { status: 404, statusText: 'Not Found' });
  });
  

  it('should fetch user repositories', () => {
    const username = 'johnpapa';

    service.getRepos(username).subscribe(repos => {
      expect(repos).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`https://api.github.com/users/${username}/repos`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockReposData);
  });

  it('should handle errors when fetching user repositories', () => {
    const username = 'johnpapa';

    service.getRepos(username).subscribe(
      () => {
        fail('Expected an error, but received data');
      },
      error => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpTestingController.expectOne(`https://api.github.com/users/${username}/repos`);
    expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('network error'));
  });

  it('should fetch repository languages', () => {
    const username = 'johnpapa';
    const repoName = 'angular';

    service.getRepoLanguages(username, repoName).subscribe(languages => {
      expect(languages).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`https://api.github.com/repos/${username}/${repoName}/languages`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockRepoLanguagesData);
  });
});
