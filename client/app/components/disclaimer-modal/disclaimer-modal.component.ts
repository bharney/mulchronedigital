import { Component, OnInit } from "@angular/core";
import { UserRegisterEmitter } from "../../shared/services/emitters/user-register-emitter.service";
declare const $: any;

@Component({
  selector: "app-disclaimer-modal",
  templateUrl: "./disclaimer-modal.component.html",
  styleUrls: ["./disclaimer-modal.component.css"]
})
export class DisclaimerModalComponent implements OnInit {

  constructor(
    private userRegisterEmitter: UserRegisterEmitter
  ) { }

  ngOnInit() {
  }

  public handleDenyDisclaimerModal() {
    $("#disclaimer-modal").modal("hide");
  }

  public handleAccpectModalDisclaimer() {
    const emitterObject = { "type": "user accepted disclaimer", "event": event };
    this.userRegisterEmitter.emitChange(emitterObject);
    $("#disclaimer-modal").modal("hide");
  }
}
