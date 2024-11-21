import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "../../services/login.service";
import {UserInterface} from "../../models/user.interface";
import {environment} from "../../../environments/environment";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {MessageHelperService} from "../../services/message-helper.service";

@Component({
  selector: 'my-app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {

  formBuilder = inject(FormBuilder);
  http = inject(HttpClient)
  loginService = inject(LoginService)
  messageService = inject(MessageHelperService)

  form = this.formBuilder.nonNullable.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  })

  onSubmit(): void {
    if (!this.form.valid) {
      this.sendErrorMessage("Please fill out all fields");
      return;
    }
    let data = this.form.getRawValue();
    this.http.post<UserInterface>(environment.apiUrl + "/authenticate", data)
      .subscribe({
        next: (user) => {
          this.loginService.login(user);
        },
        error: (err) => {
          let message = "Server Error. Please try again later.";
          if (err.status === 401) {
            message = "Invalid Credentials. Please try again."
          }
          this.sendErrorMessage(message);

        }
      })
  }

  private sendErrorMessage(message: string) {
    this.messageService.sendErrorMessage("Login failed!", message);
  }
}
