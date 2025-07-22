// Service mock ContratBailService
import { ContratBail } from "@/entities/ContratBail";

const ContratBailService = {
  async filter(params: Partial<ContratBail>): Promise<ContratBail[]> {
    // À remplacer par un vrai appel API
    return [];
  },
};

export default ContratBailService;
