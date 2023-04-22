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
    baseApi = 'https://vn-public-apis.fpo.vn';
    constructor(private http: HttpClient) {}

    getAllProvinces() : Observable<Province[]>{
      return this.http.get<GetResponseProvince>(`${this.baseApi}/provinces/getAll?limit=-1`).pipe(
        map(response => response.data.data)
      )
    }
    
    getDistrictsByProvince(provinceCode: string) : Observable<District[]>{
      return this.http.get<GetResponseDistrict>(`${this.baseApi}/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`).pipe(
        map(response => response.data.data)
      )
    }

    getWardsByProvince(districtCode: string) : Observable<District[]>{
      return this.http.get<GetResponseWard>(`${this.baseApi}/wards/getByDistrict?districtCode=${districtCode}&limit=-1`).pipe(
        map(response => response.data.data)
      )
    }
}

interface GetResponseProvince {
  data: {
    data: Province[];
  }
}

interface GetResponseDistrict {
  data: {
    data: District[];
  }
}

interface GetResponseWard {
  data: {
    data: Ward[];
  }
}
