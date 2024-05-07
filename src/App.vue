<template>
  <div>
    <AppointmentsHeader  @selected-agents-change="handleSelectedAgents" @status-change="handleStatusChange" @date-change="handleDateChange"
    @search="handleSearch" />
    <div class="my-4 mx-5">
      <AppointmentRow v-for="appointment in records" :key="appointment.id" :appointment="appointment" />
      <div v-if="!records" class="text-center text-gray-600 my-4">
        There are no records to display.
      </div>
      <Pagination :totalPages="totalPages" :currentPage="currentPage" :hasNext="hasNext" @change="handlePageChange" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import AirtableService from './api/AirtableService';
import AppointmentRow from './components/AppointmentRow.vue';
import AppointmentsHeader from './components/AppointmentsHeader.vue';
import Pagination from './components/Pagination.vue';

export default {
  components: { AppointmentRow, AppointmentsHeader, Pagination },
  setup() {
    const records = ref([]);
    const totalPages = ref(0);
    const currentPage = ref(1);
    const hasNext = ref(false);
    const currentOffset = ref('');
    const offsets = ref({});
    const selectedAgentIds = ref([]);
    const selectedStatus = ref('all');
    const selectedDates = ref({ startDate: null, endDate: null });
    const searchTerm = ref('');

    const fetchRecords = async (page) => {
      const offset = offsets.value[page - 1] || '';

      let appointments = [];
      let agentIds;
      let filterStatus = '';

      if (selectedAgentIds.value.length > 0) {
        agentIds = selectedAgentIds.value;

      }

      if (selectedDates.value.startDate && selectedDates.value.endDate &&
        new Date(selectedDates.value.startDate) > new Date(selectedDates.value.endDate)) {
        alert("End date must not be before start date.");
        return;
      }

      if (selectedStatus.value === 'cancelled') {
        filterStatus = `{is_cancelled} = TRUE()`;
      } else if (selectedStatus.value === 'upcoming') {
        filterStatus = `AND({is_cancelled} != TRUE(), {appointment_date} > NOW())`;
      } else if (selectedStatus.value === 'completed') {
        filterStatus = `AND({is_cancelled} != TRUE(), {appointment_date} <= NOW())`;
      }

      const response = await AirtableService.listRecords('Appointments', {
        pageSize: 5,
        offset: offset,
        sortField: 'appointment_date',
        sortDirection: 'desc',
        agentIds: agentIds,
        filterStatus: filterStatus,
        startDate: selectedDates.value.startDate,
        endDate: selectedDates.value.endDate,
        searchQuery: searchTerm.value,
      });

      if (response.records.length > 0) {
        appointments = response.records;
        records.value = response.records;
        offsets.value[page] = response.offset;
        hasNext.value = !!response.offset
      } else {
        appointments = null;
        offsets.value[page] = response.offset;
      }


      records.value = appointments;
    };

    const handleSearch = (newSearchTerm) => {
      searchTerm.value = newSearchTerm;
      fetchRecords(); // Refetch records when search term changes
    };

    const handlePageChange = newPage => {
      currentPage.value = newPage;
      fetchRecords(newPage);
    };

    const handleSelectedAgents = (agentIds) => {
      selectedAgentIds.value = agentIds;
      console.log("Selected Agent IDs updated:", selectedAgentIds.value);
      calculateTotalPages();
      fetchRecords(currentPage.value);  // Trigger re-fetching or just re-filtering depending on setup
    };

    const handleStatusChange = (status) => {
      selectedStatus.value = status;
      console.log("Selected status updated:", selectedStatus.value);
      calculateTotalPages();
      fetchRecords();
    }

    const handleDateChange = (dates) => {
      selectedDates.value = dates;
      fetchRecords(currentPage.value);
    };

    const calculateTotalPages = async () => {
      const totalRecords = await AirtableService.getTotalRecords('Appointments', {
        agentIds: selectedAgentIds.value,
        filterStatus: selectedStatus.value === 'all' ? '' : selectedStatus.value === 'cancelled' ? `{is_cancelled} = TRUE()` :
          selectedStatus.value === 'upcoming' ? `AND({is_cancelled} != TRUE(), {appointment_date} > NOW())` :
            `AND({is_cancelled} != TRUE(), {appointment_date} <= NOW())`
      });
      console.log("Total records:", totalRecords);
      totalPages.value = Math.ceil(totalRecords / 10);
    };

    watch(selectedAgentIds, () => {
      // Reset pagination possibly
      currentPage.value = 1;
      calculateTotalPages();
      fetchRecords(currentPage.value);  // Refetch records with the new agent filter
    }, { immediate: true });

    watch(selectedStatus, () => {
      calculateTotalPages();
      fetchRecords(currentPage.value);
    }, { immediate: true });

    onMounted(async () => {
      await calculateTotalPages();
      await fetchRecords(currentPage.value);
    });

    return {
      records, currentPage, totalPages, hasNext, handlePageChange, handleSelectedAgents, handleStatusChange, handleDateChange, handleSearch
    };
  }
};
</script>
