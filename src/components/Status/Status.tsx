import { IStatusProps } from 'components/Status/Status.types'

const Status = ({ status }: IStatusProps) => {
  let className =
    'inline-flex items-center gap-1.5 uppercase text-xs font-bold px-2 py-1 rounded-md'
  switch (status) {
    case 'stolen':
      className += ' bg-red-50 text-red-600'
      break
    case 'found':
      className += ' bg-green-50 text-green-600'
      break
    case 'with owner':
      className += ' bg-blue-50 text-blue-600'
      break
    case 'impounded':
      className += ' bg-purple-50 text-purple-600'
      break
    default:
      className += ' bg-gray-50 text-gray-600'
      break
  }

  return (
    <div className={className}>
      <div className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{status}</span>
    </div>
  )
}

export default Status
