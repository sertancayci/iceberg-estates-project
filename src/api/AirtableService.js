import axios from "axios";

const API_URL = "https://api.airtable.com/v0/appkTtnhXACqj0kag";
const API_KEY =
  "pats4IHMpAYtX3SEI.81078c3ca51bc35dcecb9fc0021792bcf1edbf266468eae8fc2ebcae61298908";
const headers = {
  Authorization: `Bearer ${API_KEY}`,
};

// const getTotalRecords = async (tableName, { agentIds = [], filterStatus = '', startDate = null, endDate = null, searchQuery } = {}) => {
//   let apiUrl = `${API_URL}/${tableName}?view=Grid%20view`;

//   let totalRecords = 0;
//   let offset = "";

//   let formulaParts = [];

//   if (agentIds && agentIds.length > 0) {
//     const agentsFilter = agentIds
//       .map(id => `FIND('${id}', ARRAYJOIN(agent_id)) > 0`)
//       .join(", ");
//     formulaParts.push(`OR(${agentsFilter})`);
//   }

//   if (filterStatus) {
//     formulaParts.push(`(${filterStatus})`);
//   }

//   if (startDate) {
//     formulaParts.push(`IS_AFTER({appointment_date}, '${startDate}')`);
//   }

//   if (endDate) {
//     formulaParts.push(`IS_BEFORE({appointment_date}, '${endDate}')`);
//   }

//   if (searchQuery) {
//     const searchTerm = searchQuery;
//       const searchFormula= [
//         `REGEX_MATCH({appointment_address}, '${searchTerm}')`,
//         `REGEX_MATCH(ARRAYJOIN({contact_name}, ', '), '${searchTerm}')`,
//         `REGEX_MATCH(ARRAYJOIN({contact_surname}, ', '), '${searchTerm}')`,
//         `REGEX_MATCH(ARRAYJOIN({contact_email}, ', '), '${searchTerm}')`,
//         `REGEX_MATCH(ARRAYJOIN({contact_phone}, ', '), '${searchTerm}')`
//       ];
//       const filterByFormula = `OR(${searchFormula.join(', ')})`;
//       formulaParts.push(filterByFormula);
//     }

//   if (formulaParts.length > 0) {
//     const combinedFormula = `AND(${formulaParts.join(', ')})`;
//     apiUrl += `&filterByFormula=${encodeURIComponent(combinedFormula)}`;
//     console.log("API URL:", apiUrl); // Debugging: Check the final URL
//   }

//   try {
//     do {
//       const response = await axios.get(
//         apiUrl + `&offset=${offset}`,
//         { headers }
//       );
//       totalRecords += response.data.records.length;
//       offset = response.data.offset || "";
//     } while (offset);
//   } catch (error) {
//     console.error("Error fetching total records:", error);
//   }

//   return totalRecords;
// };

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
  getTotalRecords,
  getAgentsDetails,
  getContacts,
};
