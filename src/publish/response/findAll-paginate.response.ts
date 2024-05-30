import { Publish } from 'src/db/schema/publish.schema';

export interface PublishPaginate {
  docs: Publish[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: any;
  nextPage: any;
}
