import Image from 'next/image'
import { useRouter } from 'next/router'

import Status from 'components/Status/Status'

// --- Types
import { IBikeListProps } from 'components/BikeList/BikeList.types'

const BikeList = (props: IBikeListProps) => {
  const router = useRouter()

  const {
    bikes,
    currentPage,
    setCurrentPage,
    startItems,
    endItems,
    totalItems
  } = props

  if (bikes.length === 0) return <div>No data found!</div>

  const handleClick = (bikeId: number) => {
    router.push(`bike/${bikeId}`)
  }

  const onPreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage: number) => prevPage - 1)
    }
  }

  const onNextClick = () => {
    if (endItems !== totalItems) {
      setCurrentPage((prevPage: number) => prevPage + 1)
    }
  }

  return (
    <div className="overflow-x-auto relative border sm:rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Serial</th>
            <th scope="col">Status</th>
            <th scope="col">
              <span className="sr-only">Icon</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {bikes.map((bike) => (
            <tr
              key={bike.id}
              className="bg-white border-b hover:bg-gray-50 hover:cursor-pointer transition-colors"
              onClick={() => handleClick(bike.id)}
            >
              <td className="font-medium whitespace-nowrap">{bike.title}</td>
              <td>{bike.serial}</td>
              <td>
                <Status status={bike.status} />
              </td>
              <td>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-4 px-6 text-sm">
        <span>
          Showing <b>{startItems}</b> to <b>{endItems}</b> of{' '}
          <b>{totalItems}</b> results
        </span>
        <div className="flex gap-4">
          <button
            className="btn"
            onClick={onPreviousClick}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <button
            className="btn"
            onClick={onNextClick}
            disabled={endItems === totalItems}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default BikeList
