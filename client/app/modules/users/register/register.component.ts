import { Component, OnInit } from "@angular/core";
import { RegisterService } from "../../../shared/services/user-authenication.service";
import { IRegisterUser } from "../../../shared/models/user-authenication.model";

@Component({
  selector: "app-register",
  styleUrls: ["./register.component.css"],
  templateUrl: "register.component.html",
  providers: [RegisterService]
})

export class RegisterComponent implements OnInit {
  register: IRegisterUser[] = [];

  constructor(private registerService: RegisterService) { }

  ngOnInit() {
    this.registerService.getList().subscribe((res) => {
      this.register = res;
    });
  }
}
