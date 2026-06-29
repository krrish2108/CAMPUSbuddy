// Delay helper to simulate network request
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AUTHENTICATION
 */
export const logoutAdmin = async () => {
  await delay();
  return { success: true };
};

/**
 * ARENA (EVENT MANAGEMENT)
 */
export const addArenaEvent = async (eventData) => {
  await delay();
  return { success: true, data: { id: `EVT-${Math.floor(Math.random() * 1000)}`, ...eventData } };
};

export const updateArenaEvent = async (id, eventData) => {
  await delay();
  return { success: true, data: { id, ...eventData } };
};

export const deleteArenaEvent = async (id) => {
  await delay();
  return { success: true };
};

/**
 * PROBLEM BOX (MANAGEMENT)
 */
export const updateTicketStatusAdmin = async (id, status, officialResponse) => {
  await delay();
  return { success: true, data: { id, status, officialResponse } };
};

export const assignTicketAdmin = async (id, departmentId) => {
  await delay();
  return { success: true, data: { id, assignedTo: departmentId } };
};
