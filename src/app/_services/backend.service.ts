import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import {Observable} from 'rxjs';
import {BackendResponse} from "../_models/backendResponse";
import {AskRequest} from "../_models/askRequest";

@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(private http: HttpClient) { }

  getEthBalance(accountId: string): Observable<BackendResponse> {
    return this.http.get<BackendResponse>(`${environment.apiUrl}/ethereum/balance?address=${accountId}`);
  }

  getTokenBalance(accountId: string): Observable<BackendResponse> {
    return this.http.get<BackendResponse>(`${environment.apiUrl}/upgradToken/balance?address=${accountId}`);
  }

  tokenTransfer(from: string, to: string, amount: string, privateKey: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/upgradToken/transfer`, {from, to, amount, privateKey});
  }

  tokenApprove(from: string, to: string, amount: string, privateKey: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/upgradToken/approve`, {from, to, amount, privateKey});
  }

  // DEFI APIs
  getAskRequests(): Observable<BackendResponse> {
    return this.http.get<BackendResponse>(`${environment.apiUrl}/defiPlatform/request`);
  }

  createAskRequest(from: string, privateKey: string, amount: string, paybackAmount: string, purpose: string, collateral: string, collateralCollectionTimeStamp: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/defiPlatform/ask`, {from, amount, privateKey, paybackAmount, purpose, collateral, collateralCollectionTimeStamp});
  }

  lendToken(from: string, privateKey: string, requestAddress: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/defiPlatform/lend`, {from, privateKey, requestAddress});
  }

  paybackToken(from: string, privateKey: string, requestAddress: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/defiPlatform/payback`, {from, privateKey, requestAddress});
  }

  collectCollateral(from: string, privateKey: string, requestAddress: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/defiPlatform/collect`, {from, privateKey, requestAddress});
  }

  cancelAskRequest(from: string, privateKey: string, requestAddress: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/defiPlatform/cancel`, {from, privateKey, requestAddress});
  }

}
