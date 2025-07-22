// Service mock LoyerService
import { Loyer } from "@/types/models";

const loyerService = {
  async getAll(params?: Partial<Loyer>): Promise<{ data: Loyer[] }> {
    // À remplacer par un vrai appel API
    return { data: [] };
  },
};

export default loyerService;
