import { useState, useEffect } from "react";
import { Bien } from "../types/models";
import { BienService } from "../services/BienService";

export function useBiens(): {
  biens: Bien[];
  isLoading: boolean;
  updateBien: (id: string, data: Partial<Bien>) => Promise<void>;
  deleteBien: (id: string) => Promise<void>;
} {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    BienService.list().then((data) => {
      setBiens(data);
      setIsLoading(false);
    });
  }, []);

  const updateBien = async (id: string, data: Partial<Bien>) => {
    setIsLoading(true);
    const updated = await BienService.update(id, data);
    setBiens((prev) => prev.map((b) => (b.id === id ? updated : b)));
    setIsLoading(false);
  };

  const deleteBien = async (id: string) => {
    setIsLoading(true);
    await BienService.delete(id);
    setBiens((prev) => prev.filter((b) => b.id !== id));
    setIsLoading(false);
  };

  return { biens, isLoading, updateBien, deleteBien };
}
