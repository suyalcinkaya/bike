export type TStatus = 'stolen' | 'found' | 'with owner' | 'impounded'

export interface IStatusProps {
  status: TStatus
}
