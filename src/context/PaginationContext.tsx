import { createContext, useContext, useState } from "react";
import { PageProp } from "../model/PageProp";

interface PaginationContextInterface {
      setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
      setStartDate: React.Dispatch<React.SetStateAction<string | undefined>>;
      setEndDate: React.Dispatch<React.SetStateAction<string | undefined>>;
      search: string | undefined;
      startDate: string | undefined;
      endDate: string | undefined;
      pageSize: number;
      setPageSize: React.Dispatch<React.SetStateAction<number>>
      setPagination: React.Dispatch<React.SetStateAction<PageProp>>;
      pagination: PageProp;
}

const PaginationContext = createContext<PaginationContextInterface | null>(null);


export const PaginationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      {/* Pagination */ }
      const [search, setSearch] = useState<string | undefined>();
      const [startDate, setStartDate] = useState<string | undefined>();
      const [endDate, setEndDate] = useState<string | undefined>();
      const [pageSize, setPageSize] = useState<number>(10);
      const [pagination, setPagination] = useState<PageProp>({
            pageNumber: 0,
            pageSize: 0,
            totalCount: 0,
            totalPage: 0
      });



      return (
            <PaginationContext.Provider
                  value={{
                        search,
                        startDate,
                        endDate,
                        pageSize,
                        setPageSize,
                        pagination,
                        setSearch,
                        setStartDate,
                        setEndDate,
                        setPagination,

                  }}
            >
                  {children}
            </PaginationContext.Provider>
      )
}

export const usePagination = () => {
      const ctx = useContext(PaginationContext);
      if (!ctx) throw new Error("usePagination must be used inside LocationProvider");
      return ctx;
}