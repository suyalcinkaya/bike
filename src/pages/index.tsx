import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'

// --- Components
import SearchInput from 'components/SearchInput/SearchInput'
import BikeList from 'components/BikeList/BikeList'

// --- Types
import type { NextPage } from 'next'
import { IBike } from 'components/BikeList/BikeList.types'

// --- Others
import { fetcher } from 'utils/utils'

const ITEMS_PER_PAGE = 25

const Home: NextPage = () => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>()
  const [startItems, setStartItems] = useState<number>()
  const [endItems, setEndItems] = useState<number>()
  const [searchText, setSearchText] = useState<string>()
  const { data: countData, error: countError } = useSWR<
    { proximity: number; stolen: number; non: number },
    Error
  >(
    searchText
      ? `${
          process.env.NEXT_PUBLIC_COUNT_API
        }?stolenness=proximity&location=${encodeURIComponent(searchText)}`
      : null,
    fetcher
  )

  const { data, error } = useSWR<{ bikes: IBike[] }, Error>(
    searchText
      ? `${
          process.env.NEXT_PUBLIC_SEARCH_API
        }?page=${currentPage}&per_page=25&stolenness=proximity&location=${encodeURIComponent(
          searchText
        )}`
      : null,
    fetcher
  )

  useEffect(() => {
    const locationParam = router.query.location
    if (locationParam) setSearchText(String(locationParam))
  }, [router.query.location])

  useEffect(() => {
    const pageParam = router.query.page
    if (pageParam) setCurrentPage(Number(pageParam))
  }, [router.query.page])

  useEffect(() => {
    if (countData) {
      const totalCount = countData.proximity // + countData.stolen + countData.non
      setTotalItems(totalCount)

      router.push(`?location=${searchText}&page=${currentPage}`, undefined, {
        shallow: true
      })

      const start = currentPage * ITEMS_PER_PAGE - (ITEMS_PER_PAGE - 1)
      setStartItems(start)
      const end = Math.min(start + ITEMS_PER_PAGE - 1, totalCount)
      setEndItems(end)
    }
  }, [countData, currentPage])

  if (error) return null
  const isLoading = Boolean(searchText && !data)

  const onFormSubmit = (value: string) => {
    setSearchText(value)
    if (searchText !== value) setCurrentPage(1) // Reset `currentPage` if the `searchText` is changed
  }

  return (
    <div className="flex flex-col gap-8">
      <SearchInput
        defaultValue={searchText || ''}
        onFormSubmit={onFormSubmit}
        isDisabled={isLoading}
      />
      {searchText && (
        <>
          {isLoading && <div>loading...</div>}
          {!isLoading && data?.bikes && (
            <BikeList
              bikes={data.bikes}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              startItems={startItems}
              endItems={endItems}
              totalItems={totalItems}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Home
