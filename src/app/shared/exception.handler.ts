import {Router} from "@angular/router";

export class ExceptionHandler {

  constructor(
    public router: Router
  ) {
  }

  public static handleError(error: any, router: Router) {
    console.log(error)
    if (error['status'] == 403) {
      router.navigate(['login'])
    }
    else if (error['status'] == 401) {
      router.navigate(['401'])
    }
    else if (error['status'] >= 500) {
      router.navigate(['500'])
    }
  }
}
