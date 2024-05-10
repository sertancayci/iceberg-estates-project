<template>
  <div>
    <div v-if="loading" class="loader"></div>

    <Header :all-agents="agents" @selected-agents-change="handleSelectedAgents" @status-change="handleStatusChange"
      @date-change="handleDateChange" @search="handleSearch" />
    <hr class="h-2 mx-5" />

    <div class="flex justify-between items-center mx-5 my-4">

      <h2 class="text-xl font-semibold text-gray-900">{{ totalAppointment }} Appointments</h2>
      <button @click="openCreateModal"
        class="bg-[#ec1e80] text-white px-4 py-2 font-semibold rounded-md flex justify-between">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6 mr-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        Create Appointment</button>

    </div>

    <div class="my-4 mx-5">
      <AppointmentTable v-for="appointment in records" :key="appointment.id" :appointment="appointment"
        :currentAppointment="currentAppointment" @edit="openEditModal" />
      <div v-if="!records" class="text-center text-gray-600 my-4">
        There are no records to display.
      </div>
      <Pagination :totalPages="totalPages" :currentPage="currentPage" :hasNext="hasNext" @change="handlePageChange" />
    </div>


    <AppointmentModal :contacts="contacts" :all-agents="agents" :isVisible="showModal" :modalMode="modalMode"
      :currentAppointment="currentAppointment" @close="handleModalClose" @update:appointments="fetchRecords"
      @submit="handleCreate" />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import AirtableService from './api/AirtableService';
import AppointmentTable from './components/AppointmentTable.vue';
import Header from './components/Header.vue';
import Pagination from './components/Pagination.vue';
import AppointmentModal from './components/AppointmentModal.vue';

export default {
  components: { AppointmentTable, Header, Pagination, AppointmentModal },
  setup() {
    const records = ref([]);
    const contacts = ref([]);
    const agents = ref([]);
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
    const loading = ref(true);
    const showModal = ref(false);
    const modalMode = ref('create');  // 'create' or 'edit'
    const currentAppointment = ref(null);

    function handleModalClose() {
      showModal.value = false;
    }

    const openCreateModal = () => {
      modalMode.value = 'create';
      currentAppointment.value = null;
      showModal.value = true;
    };

    const openEditModal = (appointment) => {
      modalMode.value = 'edit';
      currentAppointment.value = appointment;
      showModal.value = true;

    };

    const handleCreate = (formData) => {
      // console.log('Form data submitted:', formData);
      showModal.value = false;
      // Here you would handle the API call to create an appointment
    };


    const fetchRecords = async (page) => {
      loading.value = true;
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
        pageSize: 10,
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
        // console.log("total records", response.totalRecords);
        appointments = response.records;
        records.value = response.records;
        totalAppointment.value = response.totalRecords;
        totalPages.value = Math.ceil(response.totalRecords / 10);
        offsets.value[page] = response.offset;
        hasNext.value = !!response.offset
      } else {
        totalAppointment.value = response.totalRecords;
        appointments = null;
        offsets.value[page] = response.offset;
        hasNext.value = !!response.offset
      }

      loading.value = false;
      records.value = appointments;
    };

    const fetchData = async () => {
      try {
        const [agentData, contactData] = await Promise.all([
          AirtableService.getAgentsDetails(),
          AirtableService.getContacts(),
        ]);
        agents.value = agentData;
        contacts.value = contactData;
        await fetchRecords(currentPage.value);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = (newSearchTerm) => {
      searchTerm.value = newSearchTerm;
      fetchRecords();
    };

    const handlePageChange = newPage => {
      currentPage.value = newPage;
      fetchRecords(newPage);
    };

    const handleSelectedAgents = (agentIds) => {
      selectedAgentIds.value = agentIds;
      fetchRecords(currentPage.value);
    };

    const handleStatusChange = (status) => {
      selectedStatus.value = status;
      fetchRecords();
    }

    const handleDateChange = (dates) => {
      selectedDates.value = dates;
      fetchRecords(currentPage.value);
    };


    watch(selectedAgentIds, () => {
      // Reset pagination possibly
      currentPage.value = 1;
      fetchRecords(currentPage.value);  // Refetch records with the new agent filter
    }, { immediate: true });

    watch(selectedStatus, () => {
      fetchRecords(currentPage.value);
    }, { immediate: true });

    onMounted(fetchData);

    return {
      loading,
      fetchRecords,
      records,
      contacts,
      agents,
      currentPage,
      totalAppointment,
      totalPages,
      hasNext,
      handlePageChange,
      handleSelectedAgents,
      handleStatusChange,
      handleDateChange,
      handleSearch,
      showModal,
      handleCreate,
      handleModalClose,
      modalMode,
      currentAppointment,
      openCreateModal,
      openEditModal
    };
  }
};
</script>

<style scoped>
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>