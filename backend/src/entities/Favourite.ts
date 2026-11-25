export class Favourite {
  id: string;
  userId: string;
  carId: string;
  createdAt: Date;

  constructor(data: {
    id: string;
    userId: string;
    carId: string;
    createdAt?: Date;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.carId = data.carId;
    this.createdAt = data.createdAt ?? new Date();
  }

  belongsTo(userId: string): boolean {
    return this.userId === userId;
  }

  carReference(carId: string): boolean {
    return this.carId === carId;
  }
}
