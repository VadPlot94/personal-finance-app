export interface IDeleteDialogProps {
  data: { id?: string | null | undefined; name?: string | null | undefined };
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
  handleDeleteClick?: () => void;
}
