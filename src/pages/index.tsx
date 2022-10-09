import Head from 'next/head'
import dynamic from 'next/dynamic'

// --- Components
import SearchInput from 'components/SearchInput/SearchInput'
const DynamicBikeList = dynamic(() => import('components/BikeList/BikeList'))

// --- Types
import type { NextPage, GetServerSideProps } from 'next'
import { IBike } from 'components/BikeList/BikeList.types'
import { IInitialCountData } from 'components/Pagination/Pagination.types'

// --- Others
import { useContextProvider } from 'providers/ContextProvider'
import { DEFAULT_PAGE, DEFAULT_LOCATION } from 'utils/utils'

export interface IInitialBikesData {
  bikes: IBike[]
}

interface IHomeProps {
  initialBikesData: IInitialBikesData
  initialCountData: IInitialCountData
}

const Home: NextPage<IHomeProps> = ({ initialBikesData, initialCountData }) => {
  const { searchText, currentPage } = useContextProvider()

  return (
    <>
      <Head>
        <title>{`Bike Search${
          searchText ? ` for '${searchText}'` : ''
        }`}</title>
      </Head>
      <div className="flex flex-col gap-8">
        <SearchInput />
        {searchText && currentPage && (
          <DynamicBikeList
            initialBikesData={initialBikesData}
            initialCountData={initialCountData}
          />
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { location, page } = context?.query

  // Return empty props if the query parameters do not present
  if (!location && !page) {
    return {
      props: {}
    }
  }

  const locationQueryParam = location || DEFAULT_LOCATION
  // Reset the `page` query parameter if the `location` query paremeter does not present
  const pageQueryParam = page ? page : DEFAULT_PAGE

  const [bikesDataRes, countDataRes] = await Promise.all([
    fetch(
      `${
        process.env.NEXT_PUBLIC_SEARCH_API
      }?page=${pageQueryParam}&per_page=25&stolenness=proximity&location=${encodeURIComponent(
        locationQueryParam as string
      )}`
    ),
    fetch(
      `${
        process.env.NEXT_PUBLIC_COUNT_API
      }?page=${pageQueryParam}&per_page=25&stolenness=proximity&location=${encodeURIComponent(
        locationQueryParam as string
      )}`
    )
  ])

  const [bikesData, countData] = await Promise.all([
    bikesDataRes.json(),
    countDataRes.json()
  ])

  if (!bikesDataRes.ok) {
    return {
      props: {
        error: {
          statusCode: bikesDataRes.status,
          message: bikesData.error
        }
      }
    }
  }

  if (!countDataRes.ok) {
    return {
      props: {
        error: {
          statusCode: countDataRes.status,
          message: countData.error
        }
      }
    }
  }

  const { bikes = [] } = bikesData
  const { proximity = 0 } = countData

  return {
    props: {
      initialBikesData: {
        bikes
      },
      initialCountData: {
        proximity
      },
      // For the ContextProvider
      initialLocation: locationQueryParam,
      initialPage: Number(pageQueryParam)
    }
  }
}

export default Home
