import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Dashboard } from "../../modules/users/dashboard/shared/dashboard.model";

@Injectable()
export class DashboardService {

  constructor(private http: Http) { }

  getList(): Observable<Dashboard[]> {
    return this.http.get("/api/list").map(res => res.json() as Dashboard[]);
  }
}
