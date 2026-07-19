export interface IEmptyContentWrapperProps {
  hasItems: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  emptyTitle: React.ReactNode;
  emptyBody?: React.ReactNode;
}
