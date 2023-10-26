import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private readonly urlBaseApis: Record<string, string>;

  constructor() {
    this.urlBaseApis = require('../../../../config/url-base-apis.json');
    console.log(this.urlBaseApis,' <- JSON');
  }

  getUrlBaseApi(): string {
    const hostname = window.location.hostname;
    const ipWithoutLastDigits = hostname.substring(0, hostname.length - 4);

    return this.urlBaseApis[ipWithoutLastDigits];
  }
}