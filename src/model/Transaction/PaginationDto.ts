import { PaginationData } from "./PaginationData";
import { TransactionDto } from "./TransactionDto";

export interface PaginationDto{
    page:PaginationData;
    data:TransactionDto[];
}