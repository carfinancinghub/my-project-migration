// Date: 062625 [1000], © 2025 CFH
export interface IEscrowTransaction {
  _id: string;
  vehicle: { vin: string; price: number };
  user: string;
  status: string;
}
export class EscrowTransaction implements IEscrowTransaction {
  _id: string;
  vehicle: { vin: string; price: number };
  user: string;
  status: string;
  constructor(data: IEscrowTransaction) {
    this._id = data._id;
    this.vehicle = data.vehicle;
    this.user = data.user;
    this.status = data.status;
  }
}
