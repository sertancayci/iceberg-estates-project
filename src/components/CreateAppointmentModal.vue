<template>
    <div v-if="isVisible" class="modal z-[99]">
      <div class="modal-content">
        <h3>Create Appointment</h3>
        <form @submit.prevent="submitForm">
          <div>
            <label for="searchContact">Search Contact:</label>
            <input type="text" id="searchContact" v-model="form.search" placeholder="Search contacts...">
          </div>
          <div>
            <label for="address">Address:</label>
            <input type="text" id="address" v-model="form.address" required placeholder="Enter address">
          </div>
          <div>
            <label>Agent:</label>
            <select v-model="form.agentId" required>
              <option disabled value="">Please select one</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.id">{{ agent.name }}</option>
            </select>
          </div>
          <div>
            <label for="appointmentDate">Appointment Date:</label>
            <input type="datetime-local" id="appointmentDate" v-model="form.appointmentDate" required>
          </div>
          <button type="submit">Create</button>
          <button @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import AirtableService from '../api/AirtableService';
  
  export default {
    name: 'CreateAppointmentModal',
    props: {
      isVisible: Boolean
    },
    emits: ['close', 'submit'],
    setup(props, { emit }) {
      const form = ref({
        search: '',
        address: '',
        agentId: '',
        appointmentDate: ''
      });
      const agents = ref([]);
  
      const fetchAgents = async () => {
        agents.value = await AirtableService.getAgentsDetails();
      };
  
      const submitForm = () => {
        if (!form.value.address || !form.value.agentId || !form.value.appointmentDate) {
          alert('Please fill in all fields');
          return;
        }
        emit('submit', form.value);
        form.value = { search: '', address: '', agentId: '', appointmentDate: '' };
      };
  
      const closeModal = () => {
        emit('close');
      };
  
      fetchAgents();
  
      return { form, agents, submitForm, closeModal };
    }
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
  }
  </style>
  