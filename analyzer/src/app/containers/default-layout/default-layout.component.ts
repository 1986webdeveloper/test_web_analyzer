import { Component, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy {
  urlLink:any = "";
  errorMessage: boolean = false;
  isProcess: boolean = false;
  analyzData:any = {status: false, statusCode: "", statusMessage: ""};
  analyzStatus:any = -1;

  constructor(private http: HttpClient) {
  }

  analyzUrl(){
    if(this.urlLink != "" && this.isUrl(this.urlLink)){
      this.analyzStatus = -1;
      this.isProcess = true;
      this.http.post( 'http://localhost:3001/api/scrape',{url: this.urlLink}).subscribe((data:any) => {
        this.analyzData = data;
        this.analyzStatus = data.status;
      });
    }
    else{
      this.errorMessage = true;
      setTimeout(()=>{ 
        this.errorMessage = false; 
      }, 5000);
    }
  }

  isUrl(s) {
    if(s.startsWith("http://")) return true;
    else if(s.startsWith("https://")) return true;
    else return false;
 }

  ngOnDestroy(): void {
  }
}
