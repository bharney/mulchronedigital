import { Http } from "@angular/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";

  constructor(private _http: Http) {}

  ngOnInit() {
    this._http.get("/api").subscribe(res => {
      console.log(res);
    });
  }
}
