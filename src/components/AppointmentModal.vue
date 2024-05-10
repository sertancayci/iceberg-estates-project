<template>
  <div v-if="isVisible" class="modal z-[99]">
    <div class="modal-content">
      <div class="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 text-gray-600 mr-3 mb-3"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
        <span class="text-gray-900 font-semibold"
          >{{
            modalMode === "edit" ? "Edit the" : "Create an"
          }}
          Appointment</span
        >
      </div>
      <form class="w-full" @submit.prevent="submitForm">
        <div id="selectContactSection" class="w-full bg-white">
          <div
            class="border border-gray-500 rounded-lg flex justify-between py-1 px-2"
            v-if="selectedContact"
          >
            <div class="pl-2">
              <div class="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 text-gray-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <p class="text-[#171717] pl-8 font-semibold">
                  {{ selectedContact.fields.contact_name }}
                  {{ selectedContact.fields.contact_surname }}
                </p>
              </div>
              <div class="text-gray-500 flex mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 text-gray-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <p class="pl-8">{{ selectedContact.fields.contact_email }}</p>
              </div>
              <div class="text-gray-500 flex mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 text-gray-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <p class="pl-8">{{ selectedContact.fields.contact_phone }}</p>
              </div>
            </div>
            <button class="flex" @click="clearContact">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div v-else>
            <SearchBar @search="handleSearch" />
            <ul v-if="isSearching" class="max-h-36 card border search-content">
              <li
                v-for="contact in filteredContacts"
                :key="contact.id"
                @click="selectContact(contact)"
              >
                {{ contact.fields.contact_name }}
                {{ contact.fields.contact_surname }}
              </li>
            </ul>
          </div>
          <p v-if="errors && errors.selectedContact" class="error">
            {{ errors.selectedContact }}
          </p>
        </div>
        <div id="addressSection">
          <AddressInput
            id="addressInput"
            v-model="form.address"
            @input="handleInput('address')"
          />
          <p v-if="errors && errors.address" class="error">
            {{ errors.address }}
          </p>
        </div>
        <div id="selectAgentSection" class="my-3">
          <SelectBox
            label="Agents"
            :options="allAgents"
            v-model="form.selectedAgentIds"
            :multiple="true"
            @handleInput="handleInput('selectedOptionId')"
            labelKey="agent_name"
            labelSubKey="agent_surname"
          />
          <!-- <p v-if="errors && errors.selectedOptionId" class="error">{{ errors.selectedOptionId }}</p> -->
        </div>
        <div id="appointmentDateSection">
          <DatePicker
            label="Appointment Date"
            ref-name="startDateInput"
            id="appointmentDate"
            v-model="form.appointmentDate"
            @input="handleInput('appointmentDate')"
            required
          />
          <p v-if="errors && errors.appointmentDate" class="error">
            {{ errors.appointmentDate }}
          </p>
        </div>

        <!-- Status Selection Section (only for edit mode) -->
        <div v-if="modalMode === 'edit'" id="statusSection" class="my-3">
          <SelectBox
            :options="statusOptions"
            :modelValue="form.status"
            @update:modelValue="form.status = $event"
            labelKey="text"
            valueKey="value"
          />
        </div>

        <div v-if="modalMode === 'edit'">
          <RelatedAppointments
            :currentAppointmentId="currentAppointment.id"
            :contactId="currentAppointment.contact_id"
          />
        </div>

        <div
          id="buttonsSections"
          class="w-full flex justify-end items-end mt-3"
        >
          <DynamicButton
            text="Cancel"
            btnClass="bg-black hover:bg-gray-700 text-white font-semibold py-2 px-4 ml-2 rounded-md"
            :action="close"
          />

          <DynamicButton
            type="submit"
            :text="modalMode === 'edit' ? 'Save' : 'Create'"
            btnClass="bg-[#ec1e80] hover:bg-[#ec1e98] text-white font-semibold py-2 px-4 ml-2 rounded-md"
            :action="submitForm"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import SearchBar from "./SearchBar.vue";
import DatePicker from "./inputs/DatePicker.vue";
import SelectBox from "./inputs/SelectBox.vue";
import DynamicButton from "./inputs/DynamicButton.vue";
import AddressInput from "./inputs/AddressInput.vue";
import AirtableService from "../api/AirtableService";
import RelatedAppointments from "./RelatedAppointments.vue";

export default {
  name: "AppointmentModal",
  components: {
    SearchBar,
    SelectBox,
    DatePicker,
    DynamicButton,
    AddressInput,
    RelatedAppointments,
  },
  props: {
    contacts: Array,
    isVisible: Boolean,
    allAgents: Array,
    mode: {
      type: String,
      default: "create",
    },
    modalMode: String,
    currentAppointment: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["close", "submit"],
  data() {
    return {
      form: {
        address: "",
        selectedAgentIds: [],
        appointmentDate: "",
        selectedContact: null,
        status: "",
      },
      errors: {
        address: "",
        appointmentDate: "",
        selectedContact: "",
      },
      label: "",
      searchTerm: "",
      selectedContact: null,
      isSearching: false,
      isContactSelected: false,
    };
  },
  watch: {
    currentAppointment: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (this.isVisible && newVal && this.modalMode === "edit") {
          this.loadAppointment(newVal);
        }
      },
    },
  },
  computed: {
    filteredContacts() {
      const lowerSearchTerm = this.searchTerm;
      return this.contacts.filter((contact) => {
        return (
          contact.fields.contact_name.includes(lowerSearchTerm) ||
          contact.fields.contact_email
            .toLowerCase()
            .includes(lowerSearchTerm) ||
          contact.fields.contact_phone
            .toString()
            .toLowerCase()
            .includes(lowerSearchTerm)
        );
      });
    },
    statusOptions() {
      const now = new Date();
      const appointmentDate = new Date(this.form.appointmentDate);
      let options = [];

      return appointmentDate < now
        ? [
            { id: "completed", text: "Completed" },
            { id: "cancelled", text: "Cancelled" },
          ]
        : [
            { id: "upcoming", text: "Upcoming" },
            { id: "cancelled", text: "Cancelled" },
          ];
    },
  },
  onMounted() {
    if (this.modalMode === "edit" && this.currentAppointment) {
      this.loadAppointment(this.currentAppointment);
    }
  },
  methods: {
    prepareModal() {
      if (this.modalMode === "edit" && this.currentAppointment) {
        this.loadAppointment(this.currentAppointment);
      } else {
        this.clearForm();
      }
    },
    clearForm() {
      this.form = {
        address: "",
        selectedAgentIds: [],
        appointmentDate: "",
        selectedContact: null,
        status: "",
      };
      this.selectedContact = null;
      this.isContactSelected = false;
      this.clearErrors();
    },
    validateForm() {
      let isValid = true;
      this.clearErrors();
      // Validate address
      if (!this.form.address.trim()) {
        this.errors.address = "Address is required.";
        isValid = false;
      } else {
        this.errors.address = "";
      }

      // Validate appointment date
      if (!this.form.appointmentDate) {
        this.errors.appointmentDate = "Appointment date is required.";
        isValid = false;
      } else {
        const appointmentDate = new Date(this.form.appointmentDate);
        const now = new Date();

        if (appointmentDate < now) {
          this.errors.appointmentDate =
            "Appointment date cannot be in the past.";
          isValid = false;
        } else {
          this.errors.appointmentDate = "";
        }
      }
      // Validate contact selection
      if (!this.form.selectedContact) {
        this.errors.selectedContact = "Please select a contact.";
        isValid = false;
      } else {
        this.errors.selectedContact = "";
      }
      return isValid;
    },

    handleInput(field) {
      this.errors[field] = ""; // Clear the error message when user starts typing/selecting
    },

    handleSearch(searchTerm) {
      if (searchTerm.length > 0) {
        this.isSearching = true;
      } else {
        this.isSearching = false;
      }
      this.searchTerm = searchTerm;
      this.selectedContact = null; // Reset selection on new search
    },

    selectContact(contact) {
      this.form.selectedContact = contact;
      this.isSearching = false;
      this.isContactSelected = true;
      this.selectedContact = contact;
      this.handleInput("selectedContact");
    },

    clearContact() {
      this.isContactSelected = false;
      this.selectedContact = null;
    },

    close() {
      this.clearForm();
      this.$emit("close");
    },

    clearErrors() {
      this.errors = {
        address: "",
        appointmentDate: "",
        selectedContact: "",
      };
    },

    loadAppointment(appointment) {
      // Load the appointment data into form
      this.form.address = appointment.appointment_address;
      this.form.appointmentDate = appointment.appointment_date;
      this.form.selectedAgentIds = appointment.agent_id;

      const now = new Date();
      const appointmentDate = new Date(appointment.appointment_date);

      if (appointment.is_cancelled) {
        this.form.status = "cancelled";
      } else {
        this.form.status = appointmentDate < now ? "completed" : "upcoming";
      }

      // Find the contact in the contacts array using the contact_id from the appointment
      const appointmentContact = this.contacts.find(
        (contact) => contact.id === appointment.contact_id[0]
      );
      this.form.selectedContact = appointmentContact;
      this.selectedContact = appointmentContact;
    },

    fetchRelatedAppointments(appointmentId) {
      // Placeholder for fetching related appointments data
      AirtableService.getRelatedAppointments(appointmentId)
        .then((data) => {
          // Assume you have a data property to hold related appointments
          this.relatedAppointments = data;
        })
        .catch((error) =>
          console.error("Error fetching related appointments:", error)
        );
    },

    async submitForm() {
      // Handle the form submission logic here

      if (this.validateForm()) {
        this.$emit("submit", { ...this.form });
        const appointmentData = {
          appointment_date: this.form.appointmentDate,
          appointment_address: this.form.address,
          contact_id: [this.form.selectedContact.id],
        };

        if (
          this.form.selectedAgentIds &&
          this.form.selectedAgentIds.length > 0
        ) {
          appointmentData.agent_id = this.form.selectedAgentIds;
        }

        try {
          if (this.modalMode === "edit") {
            const currentAppointmentId = this.currentAppointment.id;

            if (this.form.status) {
              appointmentData.is_cancelled = this.form.status === "cancelled";
            }
            const updateAppointment = await AirtableService.updateAppointment(
              currentAppointmentId,
              appointmentData
            );
            this.$emit("submit", updateAppointment);
            this.$emit("update:appointments"); // Notify parent component to refresh the list
            this.$emit("close");
            this.close();
          } else {
            const createdAppointment = await AirtableService.createAppointment(
              appointmentData
            );
            this.$emit("submit", createdAppointment);
            this.$emit("update:appointments"); // Notify parent component to refresh the list
            this.$emit("close");
            this.close(); // Close the modal after submission
          }
        } catch (error) {
          console.error("Failed to process appointment:", error);
        }
        // this.close();
      }
    },
  },
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
  background: #f0f5f5;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  height: 40rem;
  max-width: 35rem;
  max-height: 50rem;
  overflow: auto;
}

.search-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 40rem;
  max-height: 50rem;
  overflow: scroll;
}

.error {
  color: red;
  font-size: 0.8rem;
  padding-left: 0.25rem;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
  /* Smooth transition */
  -webkit-text-fill-color: #000 !important;
  /* Ensures the text color stays consistent */
  box-shadow: 0 0 0px 1000px white inset;
  /* Tries to force the background to stay white */
}
</style>
