import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Error from 'next/error'

// --- Components
import Status from 'components/Status/Status'
import Spec from 'components/Spec/Spec'

// --- Types
import type { NextPage, GetServerSideProps } from 'next'
import { IBikeDetailsProps } from 'pages/bike/BikeDetails.types'

const BikeDetails: NextPage<IBikeDetailsProps> = (props) => {
  const router = useRouter()
  const { bike, error } = props

  if (error || !bike) {
    return <Error statusCode={error?.errorCode} title={error?.errorMessage} />
  }

  const DynamicImage = dynamic(() => import('next/image'))

  return (
    <div className="flex flex-col items-start gap-8">
      <button className="btn" onClick={() => router.back()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
          />
        </svg>
        <span>Back</span>
      </button>
      <div className="flex items-center gap-2">
        <h1>{bike.title}</h1>
        <Status status={bike.status} />
      </div>
      {bike.large_img && (
        <div className="flex border rounded-lg">
          <DynamicImage
            src={bike.large_img}
            alt={bike.title}
            width={1200}
            height={900}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">
        <Spec title="Manifacturer" value={bike.manufacturer_name} />
        <Spec title="Model" value={bike.frame_model} />
        <Spec title="Year" value={bike.year} />
        <Spec title="Serial" value={bike.serial} />
        <Spec title="Material" value={bike.frame_material_slug} />
        <Spec title="Colors" value={bike.frame_colors.join(', ')} />
        <Spec
          title="Description"
          value={bike.description}
          className="md:col-span-2"
        />
        <Spec title="Stolen at" value={bike.stolen_location} />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context?.params?.id
  const res = await fetch(`${process.env.BIKES_API}/${id}`)
  const data = res ? await res?.json() : undefined

  if (!data) {
    return {
      notFound: true
    }
  }

  const { bike, error } = data
  return {
    props: {
      bike: bike ?? null,
      error: res.ok ? null : { errorCode: res?.status, errorMessage: error }
    }
  }
}

export default BikeDetails
