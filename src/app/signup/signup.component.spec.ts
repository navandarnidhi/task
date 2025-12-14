import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  let routerSpy: jasmine.SpyObj<Router>
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [SignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    const controls = component.signupForm.controls;
    expect(controls['name']).toBeDefined();
    expect(controls['phone']).toBeDefined();
    expect(controls['email']).toBeDefined();
    expect(controls['password']).toBeDefined();
    expect(controls['confirmPassword']).toBeDefined();
  });

  it('should mark form as touched if invalid on submit', () => {
    spyOn(component.signupForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.signupForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should alert if passwords do not match', () => {
    spyOn(window, 'alert');
    component.signupForm.setValue({
      name: 'John',
      phone: '1234567890',
      email: 'john@gmail.com',
      password: 'Password1!',
      confirmPassword: 'Password2!'
    });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
  });

  it('should alert if user already exists', () => {
    spyOn(window, 'alert');

    const existingUsers = [{ name: 'Jane', phone: '1234567890', email: 'jane@gmail.com', password: 'Password1!' }];
    sessionStorage.setItem('users', JSON.stringify(existingUsers));

    component.signupForm.setValue({
      name: 'Jane',
      phone: '1234567890',
      email: 'jane@gmail.com',
      password: 'Password1!',
      confirmPassword: 'Password1!'
    });

    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('User already registered with this email!');
  });

  it('should signup a new user successfully', () => {
    spyOn(window, 'alert');

    component.signupForm.setValue({
      name: 'Alice',
      phone: '1234567890',
      email: 'alice@gmail.com',
      password: 'Password1!',
      confirmPassword: 'Password1!'
    });

    component.onSubmit();

    const storedUsers = JSON.parse(sessionStorage.getItem('users') || '[]');
    expect(storedUsers.length).toBe(1);
    expect(storedUsers[0].email).toBe('alice@gmail.com');
    expect(window.alert).toHaveBeenCalledWith('Signup successful! Please log in.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should validate email pattern', () => {
    const emailControl = component.signupForm.controls['email'];
    emailControl.setValue('test@yahoo.com');
    expect(emailControl.valid).toBeFalse();
    emailControl.setValue('test@gmail.com');
    expect(emailControl.valid).toBeTrue();
  });

  it('should validate phone pattern', () => {
    const phoneControl = component.signupForm.controls['phone'];
    phoneControl.setValue('12345');
    expect(phoneControl.valid).toBeFalse();
    phoneControl.setValue('1234567890');
    expect(phoneControl.valid).toBeTrue();
  });

  it('should validate password pattern', () => {
    const passwordControl = component.signupForm.controls['password'];
    passwordControl.setValue('password'); // invalid
    expect(passwordControl.valid).toBeFalse();
    passwordControl.setValue('Password1!'); // valid
    expect(passwordControl.valid).toBeTrue();
  });
});
