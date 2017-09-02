import { Component, OnInit } from "@angular/core";

import { Register } from "./shared/register.model";
import { RegisterService } from "./shared/register.service";

@Component({
	selector: "app-register",
	templateUrl: "register.component.html",
	providers: [RegisterService]
})

export class RegisterComponent implements OnInit {
	register: Register[] = [];

	constructor(private registerService: RegisterService) { }

	ngOnInit() {
		this.registerService.getList().subscribe((res) => {
			this.register = res;
		});
	}
}
