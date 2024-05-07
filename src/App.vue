<template>
  <div>
    <Header @selected-agents-change="handleSelectedAgents" @status-change="handleStatusChange"
      @date-change="handleDateChange" @search="handleSearch" />
    <hr class="h-2 mx-5" />

    <div class="flex justify-between items-center mx-5 my-4">

      <h2 class="text-xl font-semibold text-gray-900">{{ totalAppointment }} Appointments</h2>
      <button  @click="showModal = true" class="bg-[#ec1e80] text-white px-4 py-2 font-semibold rounded-md flex justify-between">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6 mr-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        Create Appointment</button>
      <create-appointment-modal :isVisible="showModal" @close="showModal = false"
        @submit="handleCreate"></create-appointment-modal>
    </div>

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
import Header from './components/Header.vue';
import Pagination from './components/Pagination.vue';
import CreateAppointmentModal from './components/CreateAppointmentModal.vue';

export default {
  components: { AppointmentRow, Header, Pagination, CreateAppointmentModal },
  setup() {
    const records = ref([]);
    const totalAppointment = ref(0);
    const totalPages = ref(0);
    const currentPage = ref(1);
    const hasNext = ref(false);
    const currentOffset = ref('');
    const offsets = ref({});
    const selectedAgentIds = ref([]);
    const selectedStatus = ref('all');
    const selectedDates = ref({ startDate: null, endDate: null });
    const searchTerm = ref('');

    const showModal = ref(false);

    const handleCreate = (formData) => {
      console.log('Form data submitted:', formData);
      showModal.value = false;
      // Here you would handle the API call to create an appointment
    };

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
        console.log("total records", response.totalRecords);
        appointments = response.records;
        records.value = response.records;
        totalAppointment.value = response.totalRecords;
        totalPages.value = Math.ceil(response.totalRecords / 10);
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
      // calculateTotalPages();
      fetchRecords(currentPage.value);  // Trigger re-fetching or just re-filtering depending on setup
    };

    const handleStatusChange = (status) => {
      selectedStatus.value = status;
      console.log("Selected status updated:", selectedStatus.value);
      // calculateTotalPages();
      fetchRecords();
    }

    const handleDateChange = (dates) => {
      selectedDates.value = dates;
      fetchRecords(currentPage.value);
    };


    watch(selectedAgentIds, () => {
      // Reset pagination possibly
      currentPage.value = 1;
      // calculateTotalPages();
      fetchRecords(currentPage.value);  // Refetch records with the new agent filter
    }, { immediate: true });

    watch(selectedStatus, () => {
      // calculateTotalPages();
      fetchRecords(currentPage.value);
    }, { immediate: true });

    onMounted(async () => {
      // await calculateTotalPages();
      await fetchRecords(currentPage.value);
    });

    return {
      records, currentPage, totalAppointment, totalPages, hasNext, handlePageChange, handleSelectedAgents, handleStatusChange, handleDateChange, handleSearch,  showModal, handleCreate
    };
  }
};
</script>
