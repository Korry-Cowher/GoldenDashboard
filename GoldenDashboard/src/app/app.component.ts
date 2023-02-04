import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { EventDialogComponent } from './components/dialogs/add-event.component';

interface INflOdds {
  homeTeam: string;
  awayTeam: string;
  homeTeamOdds: number;
  awayTeamOdds: number;
  dateOfGame: Date;
}

interface IOdds {
  h2h: number[];
}

interface ISite {
  site_key: string;
  site_nice: string;
  last_update: number;
  odds: IOdds;
}

interface IGame {
  id: string;
  sport_key: string;
  sport_nice: string;
  teams: string[];
  commence_time: string;
  home_team: string;
  sites: ISite[];
  sites_count: number;
}

interface IOddsResponse {
  success: boolean;
  data: IGame[];
}

interface IWeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
    relativehumidity_2m: string;
    windspeed_10m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relativehumidity_2m: number[];
    windspeed_10m: number[];
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  time = new Date();
  today = new Date();
  odds: INflOdds[] = [];
  weatherDescription: string = '';

  events: any = [
    { startTime: new Date(2023, 2, 3, 10, 0), endTime: new Date(2023, 2, 3, 12, 0), title: 'Meeting with John' },
    { startTime: new Date(2023, 2, 3, 14, 0), endTime: new Date(2023, 2, 3, 16, 0), title: 'Project deadline' },
    { startTime: new Date(2023, 2, 4, 9, 0), endTime: new Date(2023, 2, 4, 11, 0), title: 'Team outing' }
  ];
  selectedDate = new Date();
  weather!: IWeatherData;
  
  constructor(private http: HttpClient, private dialog: MatDialog) {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }
  
  ngOnInit() {
    this.getWeather();
    this.getOdds();
    // Get weather data
    // this.http.get('api.openweathermap.org/data/2.5/weather?q=city_name&appid=API_KEY')
    //   .subscribe((data: any) => {
    //     this.weather = data;
    //   });
  }
  
  onDateChange() {
    this.events = this.events.filter((event: any) => {
      return event.startTime.getDate() === this.selectedDate.getDate() &&
        event.startTime.getMonth() === this.selectedDate.getMonth() &&
        event.startTime.getFullYear() === this.selectedDate.getFullYear();
    });
  }
  
  dateClass = (d: Date) => {
    const date = d.getDate();
    return this.events.some((event: any) => {
      return event.startTime.getDate() === date &&
        event.startTime.getMonth() === d.getMonth() &&
        event.startTime.getFullYear() === d.getFullYear();
    }) ? 'event-date' : '';
  }
  
  openEventDialog() {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: { startTime: this.selectedDate, endTime: this.selectedDate }
    });                     
    
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.events.push(result);
      }
    });
  }

  //Write a funtion to get nfl odds from api
  getOdds() {
    this.http.get('https://api.the-odds-api.com/v3/odds/?sport=americanfootball_nfl&oddsFormat=american&region=us&dateFormat=iso&mkt=h2h&apiKey=568acc8c025c1144333bfeb2b184b3b9')
      .subscribe((upcomingNFLGames: any) => {
        console.log(upcomingNFLGames);
        
        upcomingNFLGames.data.forEach((game: IGame) => {
          
          let nflOddsGame: INflOdds = {
            homeTeam: game.home_team,
            awayTeam: game.teams.find((team: any) => team !== game.home_team) || "",
            homeTeamOdds: game.sites.find((site: any) => site.site_key === "draftkings")?.odds.h2h[1] || 0,
            awayTeamOdds: game.sites.find((site: any) => site.site_key === "draftkings")?.odds.h2h[0] || 0,
            dateOfGame: new Date(game.commence_time),
          }

          this.odds.push(nflOddsGame);
        });
      });
  }

  //write a function to get the weather data from the api and map it to IWeatherData
  getWeather() {  
    this.http.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&temperature_unit=fahrenheit')
      .subscribe((weatherData: any) => {
        this.weather = weatherData as IWeatherData;
        this.weatherDescription = this.mapWeatherCodeToString(this.weather.current_weather.weathercode);
        console.log(this.weatherDescription);
      });
    }

    private mapWeatherCodeToString(code: number) {
      switch (code) {
        case 0: return 'Clear sky';
        case 1: return 'Mainly clear sky'
        case 2: return 'Partly cloudy'
        case 3: return 'Overcast';
        case 45: return 'Foggy';
        case 48: return 'Foggy';
        case 51: return 'Light-Drizzle';
        case 53: return 'Moderate-Drizzle';
        case 55: return 'Heavy-Drizzle';
        case 56: return 'Freezing Light Drizzle';
        case 57: return 'Freezing heavy Drizzle';
        case 61: return 'Slight Rain';
        case 63: return 'Moderate Rain';
        case 65: return 'Intense Rain';
        case 66: return 'Freezing Rain: Light intensity';
        case 67: return 'Freezing Rain: heavy intensity';
        case 71: return 'Slight Snow';
        case 73: return 'Moderate Snow';
        case 75: return 'Heavy Snow';
        case 77: return 'Snow Grains';
        case 80: return 'Rain Showers: Light';
        case 81: return 'Rain Showers: Moderate';
        case 82: return 'Rain Showers: Violent';
        case 85: return 'Snow Showers: Light';
        case 86: return 'Snow Showers: Heavy';
        case 95: return 'Thunderstorm: Light';
        case 96: return 'Thunderstorm: Moderate';
        case 99: return 'Thunderstorms with Hail';
        default:
          return 'Not real sure, could be anything';
      }
    }
  }


