// --- Types
import { ISearchInputProps } from 'components/SearchInput/SearchInput.types'

const SearchInput = ({
  defaultValue,
  onFormSubmit,
  isDisabled
}: ISearchInputProps) => {
  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)
    const { search } = data
    onFormSubmit(search as string)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label htmlFor="city-search" className="text-sm font-semibold">
        City
      </label>
      <div className="relative">
        <div className="flex items-center absolute inset-y-0 left-4 pointer-events-none">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </div>
        <input
          ref={(element) => element?.focus?.()}
          type="search"
          id="city-search"
          name="search"
          className="input"
          placeholder="Amsterdam, Berlin, etc."
          defaultValue={defaultValue}
          disabled={isDisabled}
          required
        />
        <button
          type="submit"
          className="btn absolute right-[9px] bottom-[9px]"
          disabled={isDisabled}
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchInput
