import { TestBed, inject } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorModalComponent } from "./error-modal.component";

describe("a error-modal component", () => {
  let component: ErrorModalComponent;
  
  // register all needed dependencies
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        ErrorModalComponent
      ]
    });
  });

  // instantiation through framework injection
  beforeEach(inject([ErrorModalComponent], (ErrorModalComponent) => {
    component = ErrorModalComponent;
  }));

  it("should have an instance", () => {
    expect(component).toBeDefined();
  });
});
