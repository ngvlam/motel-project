import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import {Province} from '../model/province'
import { District } from '../model/district';
import { Ward } from '../model/ward';


@Injectable({
  providedIn: 'root'
})

export class ProvinceService {
    baseApi = 'https://vapi.vnappmob.com/api/province';
    constructor(private http: HttpClient) {}

    getAllProvinces() : Observable<Province[]>{
      return this.http.get<GetResponseProvince>(`${this.baseApi}`).pipe(
        map(response => response.results)
      )
    }
    
    getDistrictsByProvince(provinceCode: string) : Observable<District[]>{
      return this.http.get<GetResponseDistrict>(`${this.baseApi}/district/${provinceCode}`).pipe(
        map(response => response.results)
      )
    }

    getWardsByProvince(districtCode: string) : Observable<Ward[]>{
      return this.http.get<GetResponseWard>(`${this.baseApi}/ward/${districtCode}`).pipe(
        map(response => response.results)
      )
    }
}

interface GetResponseProvince {
  results: Province[]
}

interface GetResponseDistrict {
  results: District[]
}

interface GetResponseWard {
  results: Ward[]
}
