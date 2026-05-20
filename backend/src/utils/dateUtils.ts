export const setEndDate = (endDate : string) => {
    const d = new Date(endDate);
    d.setHours(23, 59, 59, 999);
      
    return d;
}

export const setStartDate = (startDate : string) => {
    const d = new Date(startDate);
    d.setHours(0, 0, 0, 0);
    return d;
}
