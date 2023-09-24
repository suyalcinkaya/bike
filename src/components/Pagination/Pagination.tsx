import useSWR from 'swr'
import dynamic from 'next/dynamic'

// --- Components
const DynamicSkeleton = dynamic(() => import('components/Skeleton/Skeleton'))

// --- Types
import {
  IPaginationProps,
  IInitialCountData
} from 'components/Pagination/Pagination.types'

// --- Others
import { useContextProvider } from 'providers/ContextProvider'
import { ITEMS_PER_PAGE } from 'utils/utils'

const Pagination = ({ initialCountData }: IPaginationProps) => {
  const {
    shouldFetchCountData,
    shouldFetchBikesData,
    setShouldFetchBikesData,
    searchText,
    currentPage,
    setCurrentPage
  } = useContextProvider()

  const { data: countData } = useSWR<IInitialCountData, Error>(
    shouldFetchCountData && searchText
      ? `${
          process.env.NEXT_PUBLIC_COUNT_API
        }?stolenness=proximity&location=${encodeURIComponent(searchText)}`
      : null,
    {
      fallbackData: initialCountData
    }
  )

  const totalItems = countData?.proximity || 0
  const start = currentPage * ITEMS_PER_PAGE - (ITEMS_PER_PAGE - 1)
  const end = Math.min(start + ITEMS_PER_PAGE - 1, totalItems)

  const onPreviousClick = () => {
    if (currentPage > 1) {
      if (!shouldFetchBikesData) setShouldFetchBikesData(true)
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const onNextClick = () => {
    if (end !== totalItems) {
      if (!shouldFetchBikesData) setShouldFetchBikesData(true)
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-2.5 px-6 text-sm">
      {!countData && (
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full py-3 md:py-2.5">
          <div className="w-1/2 md:w-1/4">
            <DynamicSkeleton />
          </div>
          <div className="w-1/2 md:w-1/4">
            <DynamicSkeleton />
          </div>
        </div>
      )}
      {countData && (
        <>
          <span>
            Showing <b>{start}</b> to <b>{end}</b> of <b>{totalItems}</b>{' '}
            results
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
              disabled={end === totalItems}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Pagination
