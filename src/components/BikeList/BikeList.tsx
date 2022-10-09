import { Fragment } from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
const DynamicLink = dynamic(() => import('next/link'))

// --- Components
import Status from 'components/Status/Status'
import Pagination from 'components/Pagination/Pagination'

// --- Types
import { IBikeListProps } from 'components/BikeList/BikeList.types'

// --- Others
import { useContextProvider } from 'providers/ContextProvider'

const BikeList = ({ initialBikesData, initialCountData }: IBikeListProps) => {
  const { searchText, currentPage, shouldFetchBikesData } = useContextProvider()

  /**
   * The `location` parameter is ignored unless `stolenness` parameter is "proximity"
   * See: https://bikeindex.org/documentation/api_v3#!/search/GET_version_search_format_get_0
   */
  const { data: bikesData, isLoading } = useSWR(
    shouldFetchBikesData && searchText && currentPage
      ? `${
          process.env.NEXT_PUBLIC_SEARCH_API
        }?page=${currentPage}&per_page=25&stolenness=proximity&location=${encodeURIComponent(
          searchText
        )}`
      : null,
    {
      fallbackData: initialBikesData
    }
  )

  if (bikesData?.bikes?.length === 0 && !isLoading) {
    return (
      <div className="grid place-items-center gap-2">
        <p>No data found. Try to type another city.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white md:rounded-lg border md:border-gray-200 -mx-8 md:mx-0">
        <Pagination initialCountData={initialCountData} />
        {bikesData?.bikes.map((bike) => (
          <Fragment key={bike.id}>
            <DynamicLink href={`/bike/${bike.id}`} className="item-link">
              <span className="col-span-6 lg:col-span-4">
                <span className="line-clamp-1 font-semibold">{bike.title}</span>
              </span>
              <span className="hidden lg:block lg:col-span-3">
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                  <span className="line-clamp-1">{bike.serial}</span>
                </span>
              </span>
              <span className="col-span-4 lg:col-span-2 justify-self-end">
                <Status status={bike.status} />
              </span>
              <span className="hidden lg:block lg:col-span-1 justify-self-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            </DynamicLink>
          </Fragment>
        ))}
        {bikesData?.bikes && bikesData?.bikes?.length > 15 && (
          <Pagination initialCountData={initialCountData} />
        )}
      </div>
    </>
  )
}

export default BikeList
