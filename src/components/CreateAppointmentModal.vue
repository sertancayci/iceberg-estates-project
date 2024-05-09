<template>
    <div v-if="isVisible" class="modal z-[99]">
        <div class="modal-content">
            <h3>Create Appointment</h3>
            <form class="w-full" @submit.prevent="submitForm">
                <div class="w-full">
                    <div class="border border-gray-500 rounded-lg flex justify-between py-1 px-2"
                        v-if="selectedContact">
                        <div class="pl-2">
                            <div class="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <p class="text-[#171717] pl-8 font-semibold"> {{ selectedContact.fields.contact_name }}
                                    {{ selectedContact.fields.contact_surname }}
                                </p>
                            </div>
                            <div class="text-gray-500 flex mt-1"> <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                    class="w-6 h-6 text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <p class="pl-8">{{ selectedContact.fields.contact_email }}</p>
                            </div>
                            <div class="text-gray-500 flex mt-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                    class="w-6 h-6 text-gray-500">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <p class="pl-8"> {{ selectedContact.fields.contact_phone }}</p>
                            </div>

                        </div>
                        <button class="flex" @click="clearContact"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div v-else>
                        <SearchBar @search="handleSearch" />
                        <ul v-if="isSearching" class="max-h-36 card border my-3 search-content">
                            <li v-for="contact in filteredContacts" :key="contact.id" @click="selectContact(contact)">
                                {{ contact.fields.contact_name }}  {{ contact.fields.contact_surname }}
                            </li>
                        </ul>
                    </div>
                </div>
                <div
                    class="flex flex-row justify-between items-center  border border-gray-400 rounded-lg p-1 px-3 pt-0 h-12 mt-3">
                    <div class="flex flex-col">
                        <label :for="label" class="date-label text-xs text-gray-900">Address</label>
                        <input type="text" ref="address" id="address" v-model="address"
                            class="form-control h-6 text-sm font-semibold placeholder:text-black placeholder:text-sm focus:outline-none">
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-gray-600">
                            <path
                                d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path
                                d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>


                    </div>
                </div>
                <div>
                    <SelectBox label="Agents" :options="allAgents"  v-model="selectedAgent" labelKey="agent_name" labelSubKey="agent_surname"/>
                </div>
                <div>
                    <DatePicker label="Appointment Date" ref-name="startDateInput" id="appointmentDate"
                        v-model="appointmentDate" required />
                </div>
                <div class="w-full flex justify-end items-end mt-3">
                    <button type="submit">Create</button>
                    <button @click="closeModal">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import SearchBar from './SearchBar.vue';
import DatePicker from './inputs/DatePicker.vue';
import SelectBox from './inputs/SelectBox.vue';


export default {
    components: {
        SearchBar,
        SelectBox,
        DatePicker
    },
    props: {
        contacts: Array,
        isVisible: Boolean,
        allAgents: Array,
    },
    data() {
        return {
            searchTerm: '',
            selectedContact: null,
            isSearching: false,
            isContactSelected: false,
        };
    },
    computed: {
        filteredContacts() {
            const lowerSearchTerm = this.searchTerm;
            return this.contacts.filter(contact => {
                return (
                    contact.fields.contact_name.includes(lowerSearchTerm) ||
                    contact.fields.contact_email.toLowerCase().includes(lowerSearchTerm) ||
                    contact.fields.contact_phone.toString().toLowerCase().includes(lowerSearchTerm)
                );
            });
        }
    },
    methods: {
        handleSearch(searchTerm) {
            if (searchTerm.length > 0) {
                this.isSearching = true;
            } else {
                this.isSearching = false;
            }
            this.searchTerm = searchTerm;
            this.selectedContact = null;  // Reset selection on new search
        },
        selectContact(contact) {
            this.isSearching = false;
            this.isContactSelected = true;
            this.selectedContact = contact;
            this.$emit('contact-selected', contact);
        },
        clearContact() {
            this.isContactSelected = false;
            this.selectedContact = null;
        }
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
    height: 20rem;
    max-width: 40rem;
    max-height: 50rem;
    overflow: scroll;
}
</style>