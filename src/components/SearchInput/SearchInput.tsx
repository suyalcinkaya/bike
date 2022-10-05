import { useRef, useEffect } from 'react'

// --- Types
import { ISearchInputProps } from 'components/SearchInput/SearchInput.types'

function SearchInput({
  defaultValue,
  onFormSubmit,
  isDisabled
}: ISearchInputProps) {
  const cityInput = useRef<HTMLInputElement>(null)

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    if (cityInput?.current?.value) onFormSubmit(cityInput.current.value)
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="default-search" className="text-sm font-semibold">
        City
      </label>
      <div className="relative mt-2">
        <div className="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
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
          ref={cityInput}
          type="search"
          name="citySearch"
          className="input"
          placeholder="Amsterdam, Berlin, etc."
          required
          defaultValue={defaultValue}
          disabled={isDisabled}
        />
        <button
          type="submit"
          className="btn absolute right-2.5 bottom-2.5"
          disabled={isDisabled}
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchInput
