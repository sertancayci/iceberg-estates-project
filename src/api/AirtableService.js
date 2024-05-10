import axios from "axios";

const API_URL = "https://api.airtable.com/v0/appkTtnhXACqj0kag";
const API_KEY =
  "pats4IHMpAYtX3SEI.81078c3ca51bc35dcecb9fc0021792bcf1edbf266468eae8fc2ebcae61298908";
const headers = {
  Authorization: `Bearer ${API_KEY}`,
};

// Helper function to build filter parts
function buildFormulaParts(
  agentIds,
  filterStatus,
  searchQuery,
  startDate,
  endDate
) {
  let formulaParts = [];

  if (agentIds && agentIds.length > 0) {
    const agentFormula = agentIds
      .map((id) => `FIND('${id}', ARRAYJOIN(agent_id)) > 0`)
      .join(", ");
    formulaParts.push(`OR(${agentFormula})`);
  }

  if (filterStatus) {
    formulaParts.push(`(${filterStatus})`);
  }

  if (startDate) {
    formulaParts.push(`IS_AFTER({appointment_date}, '${startDate}')`);
  }

  if (endDate) {
    formulaParts.push(`IS_BEFORE({appointment_date}, '${endDate}')`);
  }

  if (searchQuery) {
    const searchTerm = searchQuery;
    const searchFormula = [
      `REGEX_MATCH({appointment_address}, '${searchTerm}')`,
      `REGEX_MATCH(ARRAYJOIN({contact_name}, ', '), '${searchTerm}')`,
      `REGEX_MATCH(ARRAYJOIN({contact_surname}, ', '), '${searchTerm}')`,
      `REGEX_MATCH(ARRAYJOIN({contact_email}, ', '), '${searchTerm}')`,
      `REGEX_MATCH(ARRAYJOIN({contact_phone}, ', '), '${searchTerm}')`,
    ];
    formulaParts.push(`OR(${searchFormula.join(", ")})`);
  }

  return formulaParts;
}

// Function to fetch total records
async function getTotalRecords(tableName, formula) {
  let apiUrl = `${API_URL}/${tableName}?view=Grid%20view&filterByFormula=${encodeURIComponent(
    formula
  )}`;
  let totalRecords = 0;

  try {
    let offset = "";
    do {
      const response = await axios.get(
        apiUrl + (offset ? `&offset=${offset}` : ""),
        { headers }
      );
      totalRecords += response.data.records.length;
      offset = response.data.offset || "";
    } while (offset);
  } catch (error) {
    console.error("Error fetching total records:", error);
  }

  return totalRecords;
}

// Function to list records
const listRecords = async (
  tableName,
  {
    agentIds,
    filterStatus,
    searchQuery,
    pageSize = 10,
    offset = "",
    sortField = "",
    sortDirection = "",
    startDate = null,
    endDate = null,
  }
) => {
  let records = [];
  let newOffset = null;
  let done = false;
  let totalRecords = 0;
  let apiUrl = `${API_URL}/${tableName}?pageSize=${pageSize}&view=Grid%20view&offset=${offset}&sort%5B0%5D%5Bfield%5D=${sortField}&sort%5B0%5D%5Bdirection%5D=${sortDirection}`;
  let formulaParts = buildFormulaParts(
    agentIds,
    filterStatus,
    searchQuery,
    startDate,
    endDate
  );
  let combinedFormula =
    formulaParts.length > 0 ? `AND(${formulaParts.join(", ")})` : "";
  if (combinedFormula) {
    apiUrl += `&filterByFormula=${encodeURIComponent(combinedFormula)}`;
  }

  try {
    const response = await axios.get(apiUrl, { headers });
    records = response.data.records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
    totalRecords = await getTotalRecords(tableName, combinedFormula);
    newOffset = response.data.offset;
    done = !newOffset;
  } catch (error) {
    console.error("Error listing records:", error);
  }

  return { records, offset: newOffset, done, totalRecords };
};

// Function to create a new appointment
const createAppointment = async (appointmentData) => {
  const url = `${API_URL}/Appointments`;
  try {
    const response = await axios.post(
      url,
      { fields: appointmentData },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Function to update an appointment
const updateAppointment = async (appointmentId, appointmentData) => {
  const url = `${API_URL}/Appointments/${appointmentId}`; // Directly target the record to update
  try {
    const response = await axios.patch(
      url,
      { fields: appointmentData },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error.response ? error.response.data : error);
    throw error;
  }
};

// Function to get Agents
const getAgentsDetails = async (agentIds = []) => {
  let agents = [];
  let apiUrl = `${API_URL}/Agents?view=Grid%20view`;

  // Check if there are specific agent IDs to filter by
  if (agentIds.length > 0) {
    const filterByIds = encodeURIComponent(
      agentIds.map((id) => `RECORD_ID()='${id}'`).join(", ")
    );
    apiUrl += `&filterByFormula=OR(${filterByIds})`;
  }

  try {
    let offset = "";
    do {
      const response = await axios.get(`${apiUrl}&offset=${offset}`, {
        headers,
      });
      agents = agents.concat(
        response.data.records.map((record) => ({
          id: record.id,
          ...record.fields,
        }))
      );
      offset = response.data.offset || "";
    } while (offset);
  } catch (error) {
    console.error("Error fetching agents:", error);
  }

  return agents;
};

// Function to fetch related appointments by contact ID
const getRelatedAppointmentsByContactId = async (contactId) => {
  let apiUrl = `${API_URL}/Appointments?filterByFormula={contact_id}='${contactId}'&sort%5B0%5D%5Bfield%5D=appointment_date&sort%5B0%5D%5Bdirection%5D=desc`;
  try {
    const response = await axios.get(apiUrl, { headers });
    return response.data.records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error("Error fetching related appointments:", error);
    throw error;
  }
};


const getContactIdById = async (id) => {
  try {
    const formula = `RECORD_ID() = '${id}'`;
    const response = await axios.get(
      `${API_URL}/Contacts?filterByFormula=${encodeURIComponent(formula)}`,
      { headers }
    );
    return response.data.records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error("Error fetching contact_id:", error);
    throw error;
  }
};


// Function to get all contacts
const getContacts = async () => {
  let allContacts = [];
  let offset = ""; // Start with an empty offset

  try {
    do {
      const response = await axios.get(
        `${API_URL}/Contacts?pageSize=100${offset ? "&offset=" + offset : ""}`,
        { headers }
      );
      allContacts = allContacts.concat(response.data.records);
      offset = response.data.offset; // Update the offset if there is more data
    } while (offset); // Continue while there's an offset indicating more data
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }

  return allContacts;
};

export default {
  listRecords,
  createAppointment,
  updateAppointment,
  getTotalRecords,
  getAgentsDetails,
  getContacts,
  getRelatedAppointmentsByContactId,
  getContactIdById
};
