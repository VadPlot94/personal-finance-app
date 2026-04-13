export interface IDeleteDialogProps {
  data: { id: string; name: string };
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
  handleDeleteClick?: () => void;
}
