// From UI to Back-end

export type ICreatePotDTOInput = FormData;
export type IEditPotDTOInput = FormData;

// From Back-end  to UI

export interface ICreatePotDTOOutput {
  id: string;
}

export interface IEditPotDTOOutput {
  id: string;
}
