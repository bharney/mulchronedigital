import { Component, OnInit } from "@angular/core";

import { Login } from "./shared/login.model";
import { LoginService } from "./shared/login.service";

@Component({
	selector: "app-login",
	templateUrl: "login.component.html",
	providers: [LoginService]
})

export class LoginComponent implements OnInit {
	login: Login[] = [];

	constructor(private loginService: LoginService) { }

	ngOnInit() {
		this.loginService.getList().subscribe((res) => {
			this.login = res;
		});
	}
}
