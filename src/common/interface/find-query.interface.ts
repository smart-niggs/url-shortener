import { Paging } from "./pagination.interface";

export interface FindAllQueryInterface<T> {
  data: T[],
  paging: Paging
}

export class CountQueryResponse {
  count: number
}
