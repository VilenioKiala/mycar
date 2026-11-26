class CategoryNotFoundError extends Error {
  constructor() {
    super(`Category not found`);
  }
}

export { CategoryNotFoundError };
