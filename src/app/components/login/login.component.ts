import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as shajs from 'sha.js';

import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  hash = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.authenticationService.logout();
  }

  get formControls() { 
    return this.loginForm.controls;
  }

  onSubmit() {

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    // Encrypt auth data
    this.hash = shajs('sha256').update(this.formControls.password.value).digest('hex');
    this.formControls['password'].setValue(this.hash);
    this.hash = shajs('sha256').update(this.formControls.username.value).digest('hex');
    this.formControls['username'].setValue(this.hash);

    this.loading = true;
    this.authenticationService.login(this.formControls.username.value, this.formControls.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/ear']);
          this.loading = false;
        },
        error => {
          this.formControls['username'].setValue('');
          this.formControls['password'].setValue('');
          this.error = error;
          this.loading = false;
        });

  }

}