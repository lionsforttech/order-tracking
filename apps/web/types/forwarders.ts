export interface Forwarder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateForwarderDto {
  name: string;
}

export interface UpdateForwarderDto {
  name?: string;
}
