import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
const DynamicError = dynamic(() => import('next/error'))

// --- Components
import Status from 'components/Status/Status'
import Pagination from 'components/Pagination/Pagination'
const DynamicSkeleton = dynamic(() => import('components/Skeleton/Skeleton'))

// --- Types
import { IBikeListProps, IBike } from 'components/BikeList/BikeList.types'

// --- Others
import { fetcher } from 'utils/utils'

const BikeList = ({
  initialBikesData,
  initialCountData,
  searchText,
  currentPage,
  setCurrentPage
}: IBikeListProps) => {
  const router = useRouter()

  /**
   * The `location` parameter is ignored unless `stolenness` parameter is "proximity"
   * See: https://bikeindex.org/documentation/api_v3#!/search/GET_version_search_format_get_0
   */
  const {
    data: bikesData,
    isValidating,
    error: bikesFetchError
  } = useSWR<{ bikes: IBike[]; error?: string }, Error>(
    searchText
      ? `${
          process.env.NEXT_PUBLIC_SEARCH_API
        }?page=${currentPage}&per_page=25&stolenness=proximity&location=${encodeURIComponent(
          searchText
        )}`
      : null,
    fetcher,
    {
      fallbackData: initialBikesData,
      revalidateOnMount: true
    }
  )

  if (bikesFetchError || bikesData?.error) {
    return (
      <DynamicError
        statusCode={400}
        title={bikesFetchError?.message || bikesData?.error}
      />
    )
  }

  if (bikesData?.bikes?.length === 0 && !isValidating)
    return <div>No data found!</div>

  return (
    <div className="overflow-x-auto relative border sm:rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Serial</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {(!bikesData || isValidating) && (
            <tr>
              <td className="w-3/6">
                <DynamicSkeleton />
              </td>
              <td className="w-2/6">
                <DynamicSkeleton />
              </td>
              <td className="w-1/6">
                <DynamicSkeleton />
              </td>
            </tr>
          )}
          {!isValidating &&
            bikesData?.bikes.map((bike) => (
              <tr
                key={bike.id}
                className="bg-white border-b hover:bg-gray-50 hover:cursor-pointer transition-colors"
                onClick={() => router.push(`/bike/${bike.id}`)}
                onMouseEnter={() => router.prefetch(`/bike/${bike.id}`)} // Prefetch on hover
              >
                <td className="font-medium whitespace-nowrap">{bike.title}</td>
                <td>{bike.serial}</td>
                <td>
                  <Status status={bike.status} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        initialCountData={initialCountData}
        searchText={searchText}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

export default BikeList
