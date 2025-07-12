import { Chambre } from "../../entities/Chambre";

export interface ChambreListProps {
  chambres: Chambre[];
  isLoading: boolean;
  onEdit: (chambre: Chambre) => void;
  onDelete: (id: string) => void;
}

declare const ChambreList: React.FC<ChambreListProps>;
export default ChambreList;
