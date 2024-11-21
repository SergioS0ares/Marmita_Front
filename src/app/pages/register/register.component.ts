import {Component, inject} from '@angular/core';
import {environment} from "../../../environments/environment";
import {UserInterface} from "../../models/user.interface";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {HttpClient} from "@angular/common/http";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {MessageHelperService} from "../../services/message-helper.service";

@Component({
  selector: 'my-app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder);
  http = inject(HttpClient)
  loginService = inject(LoginService)
  messageService = inject(MessageHelperService)

  form = this.formBuilder.nonNullable.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    confirmPassword: ["", Validators.required]
  })

  onSubmit(): void {
    if (!this.form.valid) {
      this.sendErrorMessage("Please fill out all fields")
      return;
    }
    let data = {
      username: this.form.getRawValue().username,
      password: this.form.getRawValue().password
    }
    console.log(data)
    this.http.post<UserInterface>(environment.apiUrl + "/register", data)
      .subscribe({
        next: (user) => {
          this.loginService.login(user);
        },
        error: (err) => {
          let message = err.status === 401 ? err.response.data.message : "Server Error. Please try again later.";
          this.sendErrorMessage(message);
        }
      })
  }

  private sendErrorMessage(message: string) {
    this.messageService.sendErrorMessage("Registration failed!", message);
  }
}
