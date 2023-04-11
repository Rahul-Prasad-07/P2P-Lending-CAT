import { Component, OnInit } from '@angular/core';
import {BackendService} from "../_services/backend.service";
import {User} from "../_models/user";
import {AuthenticationService} from "../_services/authentication.service";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AskRequest} from "../_models/askRequest";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: User;
  ethBalance: number;
  tokenBalance: number;
  transferForm: FormGroup;
  approveForm: FormGroup;
  askRequestForm: FormGroup;
  askRequests: AskRequest[];

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {

    if (!this.currentUser || !this.currentUser.account) {
      this.router.navigate(['']);
    }

    this.transferForm = this.formBuilder.group({
      accountId: ['', Validators.required],
      amount: ['', Validators.required],
    });

    this.approveForm = this.formBuilder.group({
      accountId: ['', Validators.required],
      amount: ['', Validators.required],
    });

    this.askRequestForm = this.formBuilder.group({
      askAmount: ['', Validators.required],
      paybackAmount: ['', Validators.required],
      collateral: ['', Validators.required],
      collateralCollectionTimeStamp: ['', Validators.required],
      purpose: ['', Validators.required],
    });

    this.refresh()
  }

  logout(): void {
    this.authenticationService.logout()
  }

  transfer(): void {
    if (this.transferForm.invalid) {
      return;
    }
    this.backendService.tokenTransfer(
      this.currentUser.account,
      this.transferForm.controls['accountId'].value,
      this.transferForm.controls['amount'].value,
      this.currentUser.pkey
    )
      .subscribe(result => {
        if (result.statusCode == 200) {
          this._snackBar.open('Tokens transferred', 'Dismiss', {duration: 3000})
          this.transferForm.reset({accountId: ' ', amount: '0'})
          this.refresh()
        } else {
          this._snackBar.open('Error occured', 'Dismiss', {duration: 3000})
        }
      }, error => {
        this._snackBar.open(error.error.message, 'OK')
      })
  }

  approve(): void {
    if (this.approveForm.invalid) {
      return;
    }

    this.backendService.tokenApprove(
      this.currentUser.account,
      this.approveForm.controls['accountId'].value,
      this.approveForm.controls['amount'].value,
      this.currentUser.pkey
    )
      .subscribe(result => {
        if (result.statusCode == 200) {
          this._snackBar.open('Token allowance approved', 'Dismiss', {duration: 3000})
          this.approveForm.reset({accountId: ' ', amount: '0'})
          this.refresh()
        } else {
          this._snackBar.open('Error occured', 'Dismiss', {duration: 3000})
        }
      }, error => {
        this._snackBar.open(error.error.message, 'OK')
      })
  }

  createAskRequest(): void {

    if (this.askRequestForm.invalid) {
      return;
    }

    this.backendService.createAskRequest(
      this.currentUser.account,
      this.currentUser.pkey,
      this.askRequestForm.controls['askAmount'].value,
      this.askRequestForm.controls['paybackAmount'].value,
      this.askRequestForm.controls['purpose'].value,
      this.askRequestForm.controls['collateral'].value,
      this.askRequestForm.controls['collateralCollectionTimeStamp'].value,
    )
      .subscribe(result => {
        if (result.statusCode == 200) {
          this._snackBar.open('Ask request created', 'Dismiss', {duration: 3000})
          this.askRequestForm.reset({askAmount: 0, paybackAmount: 0, purpose: ' ', collateral: 0, collateralCollectionTimeStamp: ' '})
          this.refresh()
        } else {
          this._snackBar.open('Error occured', 'Dismiss', {duration: 3000})
        }
      }, error => {
        this._snackBar.open(error.error.message, 'OK')
      })
  }

  lend(request: AskRequest): void {
    this.backendService.lendToken(
      this.currentUser.account,
      this.currentUser.pkey,
      request.requestContractAddress
    )
      .subscribe(result => {
        if (result.statusCode == 200) {
          this._snackBar.open('Tokens lent to borrower', 'Dismiss', {duration: 3000})
          this.refresh()
        } else {
          this._snackBar.open('Error occured', 'Dismiss', {duration: 3000})
        }
      }, error => {
        this._snackBar.open(error.error.message, 'OK')
      })
  }

  cancel(request: AskRequest): void {
    this.backendService.cancelAskRequest(
      this.currentUser.account,
      this.currentUser.pkey,
      request.requestContractAddress
    )
      .subscribe(result => {
        if (result.statusCode == 200) {
          this._snackBar.open('Ask request cancelled', 'Dismiss', {duration: 3000})
          this.refresh()
        } else {
          this._snackBar.open('Error occured', 'Dismiss', {duration: 3000})
        }
      }, error => {
        this._snackBar.open(error.error.message, 'OK')
      })
  }

  payback(request: AskRequest): void {
    this.backendService.paybackToken(
      this.currentUser.account,
      this.currentUser.pkey,
      request.requestContractAddress
    )
      .subscribe(result => {
        if (result.statusCode == 200) {
          this._snackBar.open('Tokens returned to lender', 'Dismiss', {duration: 3000})
          this.refresh()
        } else {
          this._snackBar.open('Error occured', 'Dismiss', {duration: 3000})
        }
      }, error => {
        this._snackBar.open(error.error.message, 'OK')
      })
  }

  collectCollateral(request: AskRequest): void {
    this.backendService.collectCollateral(
      this.currentUser.account,
      this.currentUser.pkey,
      request.requestContractAddress
    )
      .subscribe(result => {
        if (result.statusCode == 200) {
          this._snackBar.open('Collateral collected for default loan', 'Dismiss', {duration: 3000})
          this.refresh()
        } else {
          this._snackBar.open('Error occured', 'Dismiss', {duration: 3000})
        }
      }, error => {
        this._snackBar.open(error.error.message, 'OK')
      })
  }

  refresh(): void {
    this.backendService.getEthBalance(this.currentUser.account)
      .subscribe(result => {
        this.ethBalance = result.data['balance'];
      })

    this.backendService.getTokenBalance(this.currentUser.account)
      .subscribe(result => {
        this.tokenBalance = result.data['balance'];
      })

    this.backendService.getAskRequests()
      .subscribe(result => {
        this.askRequests = result.data.reverse();
      })

  }

  isRequestOpen(request: AskRequest): boolean {
    return !(request.moneyLent || request.debtSettled || request.collateralCollected);
  }

  isRequestServed(request: AskRequest): boolean {
    return request.moneyLent;
  }

}
