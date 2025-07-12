import { Bien } from "../../entities/Bien";

export interface BienListProps {
  biens: Bien[];
  isLoading: boolean;
  onEdit: (bien: Bien) => void;
  onDelete: (id: string) => void;
}

declare const BienList: React.FC<BienListProps>;
export default BienList;
