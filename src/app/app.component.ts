import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'hpmePi';

  public pumpState:number;
  public temperature:string;
  public pumpIsStarted:boolean;

  public get pumpText():string
  {
    if(this.pumpState == 0){
      return "PUMP IS STOPED";
    } else {
      return "PUMP IS STARTED";
    }  
  }

  public constructor()
  {
    console.log("fdsa");
  }

  public ngOnInit()
  {
    console.log("asdf");
    this.sendRequest("state");
  }

  public onStartPump()
  {
    if(this.pumpIsStarted)
    {
      return;
    }
    console.log("onStartPump");
    this.sendRequest("pinOn");
  }

  public onStopPump()
  {
    if(!this.pumpIsStarted)
    {
      return;
    }
    console.log("onStopPump");
    this.sendRequest("pinOff");
  }

  public onRefreshTemperature()
  {
    console.log("onRefreshTemperature");
    this.sendRequest("refreshTemperature");
  }

  private sendRequest(api:string)
  {
    let ip:string =""
    let recuest = new XMLHttpRequest();
    let url:string = ip+"api/"+api+".php";
    recuest.open("GET",url);
    let that = this;
    recuest.onreadystatechange=function(){
      if(recuest.readyState==4)
      {
        if(recuest.status==200)
        {
          that.parsResponce(recuest.responseURL, recuest.responseText)
        }else {
          console.log("API ERROR", url);
        }
      }
    }
    recuest.send();
  }

  private parsResponce(responceUrl:string, responce:string)
  {
    let state;
    switch(responceUrl)
    {
      case "http://192.168.0.102/api/state.php":
        state = JSON.parse(responce);
        console.log(state);
        this.pumpState = state.pump_State;
        this.pumpIsStarted = this.pumpState == 1;
        this.temperature = state.temperature;
        break;
      case "http://192.168.0.102/api/refreshTemperature.php":
        state = JSON.parse(responce);
        console.log(state);
        this.temperature = state.temperature;
        break;
      case "http://192.168.0.102/api/pinOn.php":
      case "http://192.168.0.102/api/pinOff.php":
        state = JSON.parse(responce);
        console.log(state);
        this.pumpState = state.pump_State;
        this.pumpIsStarted = this.pumpState == 1;
      break;
    }
  }
}
