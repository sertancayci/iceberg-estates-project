<template>
    <div class="grid grid-cols-12 md:px-5 py-4 bg-white shadow">
        <!-- Tags and Status Select -->
        <div class="col-span-12 md:col-span-6 lg:col-span-2 flex items-center flex-wrap group  lg:mt-[-0.25rem]">
            <AgentsTag :agents="allAgents" :selectable="true" @agent-selected="handleSelectedAgents" />
        </div>

        <div class="col-span-12 md:col-span-6 lg:col-span-2">
            <select v-model="selectedStatus" @change="handleStatusChange"
                class="h-12 w-full rounded-lg border border-solid border-neutral-300 px-4 text-sm font-semibold">
                <option value="all">All Statuses</option>
                <option value="cancelled">Cancelled</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
            </select>
        </div>
        <!-- Date Range Picker -->
        <div class="col-span-12 md:col-span-6 lg:col-span-3 lg:ml-2.5 gap-x-2">
            <div class="flex">
                <div class="relative date-input-container flex flex-row items-end border border-gray-400 rounded-lg p-1 px-3 pt-0 h-12"
                    @click="openDatePicker('startDatePicker')">
                    <div class="flex flex-col">
                        <label for="date" class="date-label text-xs text-gray-900">From</label>
                        <input type="text" ref="startDateInput" v-model="startDate" readonly
                            class="form-control h-6 text-sm font-semibold  placeholder:text-black placeholder:text-sm focus:outline-none"
                            placeholder="Select">
                    </div>
                    <a class="input-button" title="toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>

                    </a>
                </div>
                <div class="relative date-input-container flex flex-row items-end border border-gray-400 rounded-lg p-1 px-3 pt-0  h-12 ml-1 md:ml-4"
                    @click="openDatePicker('endDatePicker')">
                    <div class="flex flex-col">
                        <label for="date" class="date-label text-xs text-gray-900 pt-3">To</label>
                        <input type="text" ref="endDateInput" v-model="endDate" readonly
                            class="form-control h-6 text-sm font-semibold  placeholder:text-black placeholder:text-sm focus:outline-none"
                            placeholder="Select">
                    </div>
                   
                        <a class="input-button" title="toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>

                        </a>
                   
                </div>
            </div>
        </div>
        <!-- Search Bar -->
        <div class="relative col-span-12 md:col-span-6 lg:col-span-5 flex justify-self-end">
            <SearchBar @search="handleSearch" />
        </div>
    </div>
</template>

<script>
import AirtableService from '../api/AirtableService';
import SearchBar from './SearchBar.vue';
import AgentsTag from './AgentsTag.vue';
import flatpickr from "flatpickr";
import 'flatpickr/dist/themes/light.css';

export default {
    name: 'AppointmentsHeader',
    props: {
        handleSelectedAgentsChange: Function,
        handleSearch: Function, // Define handleSearch as a prop
    },
    components: {
        SearchBar,
        AgentsTag
    },
    data() {
        return {
            selectedStatus: 'all',
            startDate: '',
            endDate: '',
            searchQuery: '',
            allAgents: [],
            selectedAgentIds: []
        };
    },
    watch: {
        currentStatus(newStatus) {
            this.$emit('status-change', newStatus);
        }
    },
    methods: {
        openDatePicker(picker) {
            if (this[picker]) {
                this[picker].open();
            }
        },
        tagClass(color) {
            return `w-10 h-10 text-xs font-bold z-0 hover:z-50 rounded-[50%] text-white relative cursor-pointer flex justify-center items-center  ${color}`;
        },

        handleSearch(query) {
            this.searchQuery = query;
            console.log("searchQuery", this.searchQuery);
            this.$emit('search', this.searchQuery);
        },

        handleStatusChange() {
            console.log("selectedStatus", this.selectedStatus);
            this.$emit('status-change', this.selectedStatus);
        },

        async fetchAgentDetails() {
            this.allAgents = await AirtableService.getAgentsDetails();
            // console.log("allAgents", this.allAgents);
        },

        handleSelectedAgents(agentId) {
            const index = this.selectedAgentIds.indexOf(agentId);
            if (index === -1) {
                this.selectedAgentIds.push(agentId);
            } else {
                this.selectedAgentIds.splice(index, 1);
            }

            this.$emit('selected-agents-change', this.selectedAgentIds);
        },

        onDateChange() {
            console.log("startDate", this.startDate);
            console.log("endDate", this.endDate);
            this.$emit('date-change', { startDate: this.startDate, endDate: this.endDate });
        },
    },

    created() {
        this.fetchAgentDetails();
    },
    mounted() {
        this.startDatePicker = flatpickr(this.$refs.startDateInput, {
            enableTime: true,
            altInput: true,
            dateFormat: "Y-m-d H:i K",
            onClose: (selectedDates, dateStr, instance) => {
                this.startDate = dateStr; // Update the data property when date is picked
            },
            onChange: (selectedDates, dateStr) => {
                this.startDate = dateStr;
                this.onDateChange();
            }
        });

        this.endDatePicker = flatpickr(this.$refs.endDateInput, {
            enableTime: true,
            altInput: true,
            dateFormat: "Y-m-d H:i K",
            onClose: (selectedDates, dateStr, instance) => {
                this.endDate = dateStr; // Update the data property when date is picked
            },
            onChange: (selectedDates, dateStr) => {
                this.endDate = dateStr;
                this.onDateChange();
            },
            onClear: () => {
                this.endDate = '';
                this.onDateChange();
            }
        });

    }
};
</script>

<style scoped></style>