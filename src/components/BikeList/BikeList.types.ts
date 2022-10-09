import type { TStatus } from 'components/Status/Status.types'
import { IInitialCountData } from 'components/Pagination/Pagination.types'
import { IInitialBikesData } from 'pages/index'

export interface IBike {
  id: number
  serial: string
  status: TStatus
  title: string
}

export interface IBikeListProps {
  initialBikesData: IInitialBikesData
  initialCountData: IInitialCountData
}
