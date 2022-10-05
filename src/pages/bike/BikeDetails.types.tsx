import { TStatus } from 'components/Status/Status.types'

export interface IBikeDetailsProps {
  bike?: {
    description: string
    frame_colors: string[]
    frame_model: string
    id: number
    large_img?: string
    location_found?: string
    manufacturer_name: string
    serial: string
    status: TStatus
    stolen_location: string
    title: string
    year?: number
    frame_material_slug?: string
  }
  error: {
    errorCode: number
    errorMessage: string
  }
}
