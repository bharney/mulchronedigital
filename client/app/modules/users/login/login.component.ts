import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../../shared/services/user-authenication.service";
import { ILoginUser } from "../../../shared/models/user-authenication.model";

@Component({
  selector: "app-login",
  styleUrls: ["./login.component.css"],
  templateUrl: "login.component.html",
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  login: ILoginUser[] = [];

  constructor(private loginService: LoginService) { }

  ngOnInit() {

  }
}
