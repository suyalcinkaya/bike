import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// --- Components
import SearchInput from 'components/SearchInput/SearchInput'
import BikeList from 'components/BikeList/BikeList'

// --- Types
import type { NextPage, GetServerSideProps } from 'next'
import { IBike } from 'components/BikeList/BikeList.types'
import { IInitialCountData } from 'components/Pagination/Pagination.types'

// --- Others
import { DEFAULT_PAGE, DEFAULT_LOCATION } from 'utils/utils'

export interface IInitialBikesData {
  bikes: IBike[]
}

interface IHomeProps {
  initialBikesData: IInitialBikesData
  initialCountData: IInitialCountData
  bikesError: { errorCode: number; errorMessage: string }
  countError: { errorCode: number; errorMessage: string }
  initialLocation: string
  initialPage: number
}

const Home: NextPage<IHomeProps> = ({
  initialBikesData,
  initialCountData,
  initialLocation,
  initialPage,
  bikesError,
  countError
}) => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [searchText, setSearchText] = useState<string>(initialLocation)

  useEffect(() => {
    router.push(
      {
        pathname: '/',
        query: {
          location: searchText,
          page: currentPage
        }
      },
      undefined,
      { shallow: true }
    )
  }, [searchText, currentPage])

  const DynamicError = dynamic(() => import('next/error'))
  if (bikesError) {
    return (
      <DynamicError
        statusCode={bikesError.errorCode}
        title={bikesError.errorMessage}
      />
    )
  }

  if (countError) {
    return (
      <DynamicError
        statusCode={countError.errorCode}
        title={countError.errorMessage}
      />
    )
  }

  const onFormSubmit = (value: string) => {
    setSearchText(value)
    // Reset the `currentPage` on form submit if the `searchText` has changed
    if (searchText !== value) setCurrentPage(DEFAULT_PAGE)
  }

  return (
    <>
      <Head>
        <title>{`Bike Search ${searchText && ` for '${searchText}'`}`}</title>
      </Head>
      <div className="flex flex-col gap-8">
        <SearchInput defaultValue={searchText} onFormSubmit={onFormSubmit} />
        {searchText && (
          <BikeList
            searchText={searchText}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
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

  // Return empty props if the query is empty
  if (!location && !page) {
    return {
      props: {}
    }
  }

  const locationQueryParam = location || DEFAULT_LOCATION
  // Reset the `page` query parameter if the `location` query paremeter does not present
  const pageQueryParam = location && page ? page : DEFAULT_PAGE

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

  const bikesData = bikesDataRes ? await bikesDataRes?.json() : undefined
  const countData = countDataRes ? await countDataRes?.json() : undefined

  if (!bikesData || !countData) {
    return {
      notFound: true
    }
  }

  const { bikes, error: bikesError } = bikesData
  const { proximity, error: countError } = countData
  return {
    props: {
      initialBikesData: {
        bikes: bikes ?? []
      },
      initialCountData: {
        proximity: proximity ?? null
      },
      bikesError: bikesDataRes.ok
        ? null
        : { errorCode: bikesDataRes.status, errorMessage: bikesError },
      countError: countDataRes.ok
        ? null
        : { errorCode: countDataRes.status, errorMessage: countError },
      initialLocation: locationQueryParam,
      initialPage: Number(pageQueryParam)
    }
  }
}

export default Home
