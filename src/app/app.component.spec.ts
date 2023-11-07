import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [ApiService],
      imports: [HttpClientModule],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties', () => {
    expect(component.username).toEqual('johnpapa');
    expect(component.userData).toBeUndefined();
    expect(component.repos).toEqual([]);
    expect(component.repoLanguages).toEqual({});
    expect(component.pageSize).toEqual(10);
    expect(component.currentPage).toEqual(1);
    expect(component.pagedRepos).toEqual([]);
    expect(component.userNotFound).toBeFalse();
  });

  it('should call getUserData on ngOnInit', () => {
    spyOn(component, 'getUserData');
    component.ngOnInit();
    expect(component.getUserData).toHaveBeenCalled();
  });

  it('should fetch user data and repositories successfully', () => {
    const userData = { login: 'johnpapa' };
    const repos = [{ name: 'repo1' }, { name: 'repo2' }];
    spyOn(apiService, 'getUser').and.returnValue(of(userData));
    spyOn(apiService, 'getRepos').and.returnValue(of(repos));

    component.getUserData();

    expect(component.userData).toEqual(userData);
    expect(component.repos).toEqual(repos);
    expect(component.userNotFound).toBeFalse();
  });

  it('should handle an error when fetching user data', () => {
    spyOn(apiService, 'getUser').and.returnValue(throwError('Error'));
    spyOn(apiService, 'getRepos').and.returnValue(of([]));

    component.getUserData();

    expect(component.userData).toBeNull();
    expect(component.repos).toEqual([]);
    expect(component.userNotFound).toBeTrue();
  });
  
});
