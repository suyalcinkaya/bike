export interface IInitialCountData {
  proximity: number
}

export interface IPaginationProps {
  initialCountData: IInitialCountData
  searchText: string
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}
