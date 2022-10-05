import { TStatus } from 'components/Status/Status.types'

export interface IBike {
  id: number
  serial: string
  status: TStatus
  title: string
}

export interface IBikeListProps {
  bikes: IBike[]
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  startItems?: number
  endItems?: number
  totalItems?: number
}
