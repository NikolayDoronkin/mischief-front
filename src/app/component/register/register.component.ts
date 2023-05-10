import {Component, HostBinding, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {SignInUser} from "../../model/user/signin.user";
import {Router} from "@angular/router";
import {routingAnimation} from "../../shared/routing-animation";
import {AbstractControl, EmailValidator, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  animations: [routingAnimation],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  errorMessage: string = ''

  registerForm!: FormGroup
  validatedControls: any

  @HostBinding('@routingAnimation')
  private routing: any;

  user: SignInUser = new SignInUser(
    "", "", "",
    "", "", "",
    "", "", "", "", "",
  )

  constructor(
    private loginService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', new EmailValidator()],
      login: ['', Validators.required],

      address: ['', null],
      city: ['', null],
      country: ['', null],
      image: ['', null],

      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    })

    this.validatedControls = new Map([
      [this.registerForm.controls['firstName'], false],
      [this.registerForm.controls['lastName'], false],
      [this.registerForm.controls['email'], false],
      [this.registerForm.controls['login'], false],
      [this.registerForm.controls['password'], false],
      [this.registerForm.controls['repeatPassword'], false],
    ])
  }

  checkValidation(): boolean {
    return this.registerForm.invalid
  }

  onSubmit(control: AbstractControl) {
    console.log(control.getRawValue())
    this.validatedControls.set(control, true)
  }

  goLogin() {
    this.router.navigate(['/login'])
  }

  signIn() {
    this.user.firstName = this.registerForm.controls['firstName'].getRawValue()
    this.user.lastName = this.registerForm.controls['lastName'].getRawValue()
    this.user.email = this.registerForm.controls['email'].getRawValue()
    this.user.login = this.registerForm.controls['login'].getRawValue()
    this.user.address = this.registerForm.controls['address'].getRawValue()
    this.user.city = this.registerForm.controls['city'].getRawValue()
    this.user.country = this.registerForm.controls['country'].getRawValue()
    this.user.password = this.registerForm.controls['password'].getRawValue()
    this.user.repeatPassword = this.registerForm.controls['repeatPassword'].getRawValue()

    localStorage.setItem('access_token', '')
    if (this.registerForm.controls['country'].getRawValue() == null || this.registerForm.controls['country'].getRawValue() == '') {
      this.user.image = 'https://e7.pngegg.com/pngimages/59/659/png-clipart-computer-icons-scalable-graphics-avatar-emoticon-animal-fox-jungle-safari-zoo-icon-animals-orange-thumbnail.png'
    }
    this.loginService.signIn(this.user).subscribe({
      next: (data: any) => {
        console.log(data)
        this.goLogin()
      },
      error: (error: any) => {
        console.log(error)
        if (error['status'] == 403) {
          this.router.navigate(['login'])
        } else if (error['status'] == 401) {
          this.router.navigate(['401'])
        } else if (error['status'] >= 500) {
          this.router.navigate(['500'])
        } else if (error['status'] == 404 || error['status'] == 400) {
          this.errorMessage = error['error']
          if (this.errorMessage.indexOf(':') != -1) {
            this.errorMessage = this.errorMessage.substring(0, this.errorMessage.indexOf(':'))
          }
        }
      }
    });
  }
}
