import { Component, OnInit } from "@angular/core";
import { UsersAdminstrationService } from "../../../../../shared/services/users-administration.service";
import { IUserAdministration } from "../../../../../shared/models/admin-dashboard.model";
import { AESEncryptionResult } from "../../../../../../../shared/AESEncryptionResult";
import { Encryption } from "../../../../../../../shared/Encryption";
declare const $: any;

@Component({
  selector: "app-admin-dashboard-users",
  templateUrl: "./admin-dashboard-users.component.html",
  styleUrls: ["./admin-dashboard-users.component.css"]
})
export class AdminDashboardUsersComponent implements OnInit {
  public users: IUserAdministration[];
  public modalBody: string;
  public modalTitle: string = "Error";
  public isAnActionTakingPlace = false;

  constructor(
    private usersAdminstrationService: UsersAdminstrationService
  ) { }

  ngOnInit() {
    this.getListOfUsers();
  }

  private getListOfUsers(): void {
    this.usersAdminstrationService.getUsersInformation().subscribe(response => {
      if (response.status) {
        this.users = response.users;
      }
    }, (error) => {
      this.toggleErrorModal(error.message);
    });
  }

  public async deactiveUserAccount(id: string, username: string): Promise<void> {
    if (this.isAnActionTakingPlace) {
      return;
    }
    if (!id) {
      this.toggleErrorModal(`There was a problem deactivating ${username}'s account`);
    }
    this.isAnActionTakingPlace = true;
    const encryptedDataToSend: AESEncryptionResult = await this.createEncryptedIdObject(id);
    this.usersAdminstrationService.deactiveUserAccount(encryptedDataToSend).subscribe(result => {
      if (result.status) {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i]._id === id) {
            this.users[i].isActive = false;
            break;
          }
        }
      }
      this.isAnActionTakingPlace = false;
    }, (error) => {
      this.isAnActionTakingPlace = false;
      this.toggleErrorModal(error.message);
    });
  }

  public async activeUserAccount(id: string, username: string): Promise<void> {
    if (this.isAnActionTakingPlace) {
      return;
    }
    if (!id) {
      this.toggleErrorModal(`There was a problem activating ${username}'s account`);
    }
    this.isAnActionTakingPlace = true;
    const encryptedDataToSend: AESEncryptionResult = await this.createEncryptedIdObject(id);
    this.usersAdminstrationService.activateUserAccount(encryptedDataToSend).subscribe(result => {
      if (result.status) {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i]._id === id) {
            this.users[i].isActive = true;
            break;
          }
        }
      }
      this.isAnActionTakingPlace = false;
    }, (error) => {
      this.isAnActionTakingPlace = false;
      this.toggleErrorModal(error.message);
    });
  }

  public async makeUserAdmin(id: string, username: string): Promise<void> {
    if (this.isAnActionTakingPlace) {
      return;
    }
    if (!id) {
      this.toggleErrorModal(`There was a problem making ${username} an admin`);
    }
    this.isAnActionTakingPlace = true;
    const encryptedDataToSend: AESEncryptionResult = await this.createEncryptedIdObject(id);
    this.usersAdminstrationService.makeUserAdmin(encryptedDataToSend).subscribe(result => {
      if (result.status) {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i]._id === id) {
            this.users[i].isAdmin = true;
            break;
          }
        }
      }
      this.isAnActionTakingPlace = false;
    }, (error) => {
      this.isAnActionTakingPlace = false;
      this.toggleErrorModal(error.message);
    });
  }

  public async revokeUserAdminAccess(id: string, username: string): Promise<void> {
    if (this.isAnActionTakingPlace) {
      return;
    }
    if (!id) {
      this.toggleErrorModal(`There was a problem revoking ${username}'s admin access`);
    }
    this.isAnActionTakingPlace = true;
    const encryptedDataToSend: AESEncryptionResult = await this.createEncryptedIdObject(id);
    this.usersAdminstrationService.revokeUserAdminAccess(encryptedDataToSend).subscribe(result => {
      if (result.status) {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i]._id === id) {
            this.users[i].isAdmin = false;
            break;
          }
        }
      }
      this.isAnActionTakingPlace = false;
    }, (error) => {
      this.isAnActionTakingPlace = false;
      this.toggleErrorModal(error.message);
    });
  }

  public handleUserSearchEvent(usernameSearch) {
      
  }

  private toggleErrorModal(modalBody: string) {
    this.modalBody = modalBody;
    $("#error-modal").modal();
  }

  private async createEncryptedIdObject(id: string): Promise<AESEncryptionResult> {
    const idObject = { id: id };
    return await Encryption.AESEncrypt(JSON.stringify(idObject));
  } 
}
