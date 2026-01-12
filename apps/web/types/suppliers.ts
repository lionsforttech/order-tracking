export interface Supplier {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDto {
  name: string;
}

export interface UpdateSupplierDto {
  name?: string;
}
