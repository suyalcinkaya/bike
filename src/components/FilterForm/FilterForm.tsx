import { useContextProvider } from 'providers/ContextProvider'
import { DEFAULT_PAGE } from 'utils/utils'

const FilterForm = () => {
  const {
    shouldFetchBikesData,
    setShouldFetchBikesData,
    searchText,
    setSearchText,
    setCurrentPage,
    setShouldFetchCountData
  } = useContextProvider()

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)
    const { search } = data

    // If text is different
    if (searchText !== search) {
      setCurrentPage(DEFAULT_PAGE) // Reset the `currentPage` on form submit if the `searchText` has changed
      setShouldFetchCountData(true)
      setSearchText(search as string)
      if (!shouldFetchBikesData) setShouldFetchBikesData(true)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label htmlFor="city-search" className="text-sm font-semibold">
        City
      </label>
      <div className="relative">
        <input
          type="search"
          id="city-search"
          name="search"
          className="input"
          placeholder="Amsterdam, Berlin, etc."
          defaultValue={searchText}
          required
        />
        <button type="submit" className="btn absolute right-2.5 bottom-[9px]">
          Search
        </button>
      </div>
    </form>
  )
}

export default FilterForm
