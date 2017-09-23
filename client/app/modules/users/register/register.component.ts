import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterService } from "../../../shared/services/user-authenication.service";
import { IRegisterUser } from "../../../shared/models/user-authenication.model";
import { UserAuthenicationValidator } from "../../../shared/authenication/UserAuthenicationValidators";

@Component({
  selector: "app-register",
  styleUrls: ["./register.component.css"],
  templateUrl: "register.component.html",
  providers: [RegisterService]
})

export class RegisterComponent implements OnInit {
  private userRegistrationForm: FormGroup;
  private hasTheFormBeenSubmitted = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.createFormGroup();
  }

  private createFormGroup(): void {
    this.userRegistrationForm = this.formBuilder.group({
        username: ["testuser",
            [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(12)
            ]
        ],
        email: ["testuser@gmail.com",
            [
                Validators.required,
                UserAuthenicationValidator.emailValidation
            ]
        ],
        password: ["TestPassword1!",
            [
                Validators.required,
                UserAuthenicationValidator.passwordValidation
            ]
        ],
        confirmPassword: ["TestPassword1!",
            [
                Validators.required,
                UserAuthenicationValidator.confirmPasswordValidation,
            ]
        ]
    });
}

  private toggleRegisterUser() {
    this.hasTheFormBeenSubmitted = true;
    if (!this.userRegistrationForm.valid) {
      return;
    } else {
      
    }
  }
}
