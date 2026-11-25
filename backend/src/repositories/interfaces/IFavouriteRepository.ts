interface IFavouriteRepository {
  getAllFavourites(userId: string, carId: string): Promise<void>;
}
