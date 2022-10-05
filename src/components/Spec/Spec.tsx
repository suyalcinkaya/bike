import { ISpecProps } from 'components/Spec/Spec.types'

const Spec = ({ title, value, className }: ISpecProps) => {
  if (!value) return null

  return (
    <div className={`flex flex-col gap-1 text-sm py-4 ${className}`}>
      <span className="text-slate-500 font-medium">{title}</span>
      <span className="capitalize">{value}</span>
    </div>
  )
}

export default Spec
