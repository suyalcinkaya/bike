import dynamic from 'next/dynamic'
import useSWR from 'swr'

// --- Types
import {
  IPaginationProps,
  IInitialCountData
} from 'components/Pagination/Pagination.types'

// --- Others
import { fetcher, ITEMS_PER_PAGE } from 'utils/utils'

const Pagination = ({
  initialCountData,
  searchText,
  currentPage,
  setCurrentPage
}: IPaginationProps) => {
  const {
    data: countData,
    isValidating,
    error: countDataFetchError
  } = useSWR<IInitialCountData, Error>(
    `${
      process.env.NEXT_PUBLIC_COUNT_API
    }?stolenness=proximity&location=${encodeURIComponent(searchText)}`,
    fetcher,
    {
      fallbackData: initialCountData
    }
  )

  const totalItems = countData?.proximity || 0
  const start = currentPage * ITEMS_PER_PAGE - (ITEMS_PER_PAGE - 1)
  const end = Math.min(start + ITEMS_PER_PAGE - 1, totalItems)

  const onPreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const onNextClick = () => {
    if (end !== totalItems) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const DynamicSkeleton = dynamic(() => import('components/Skeleton/Skeleton'))

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-4 px-6 text-sm">
      {countDataFetchError && <>{countDataFetchError}</>}
      {(!countData || isValidating) && (
        <>
          <div className="w-1/5">
            <DynamicSkeleton />
          </div>
          <div className="w-1/5">
            <DynamicSkeleton />
          </div>
        </>
      )}
      {countData && !isValidating && (
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
