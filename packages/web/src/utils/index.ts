export const store = async (key: string, value: string): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  try {
    await localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    return false;
  }
};

export const del = async (key: string): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  try {
    await localStorage.removeItem(key);
    return true;
  } catch (error: any) {
    return false;
  }
};

export const retrieve = async (key: string): Promise<string> => {
  if (typeof window === "undefined") return "";
  try {
    const data = await localStorage.getItem(key);
    return data ?? "";
  } catch (error: any) {
    return "";
  }
};
