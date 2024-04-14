

export const wait = async (times = 1000) => await new Promise(resolve => setTimeout(resolve, times));
